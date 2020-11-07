const express = require('express');
const router = express.Router();
//models
const  Post=require("../../models/Post");
const  Profile=require("../../models/Profile");
const  User=require("../../models/User");
//validaton
const { check, validationResult } = require('express-validator');
//middle ware fro auth
const Auth = require('../../middleware/Auth');

//@route  POST api/posts
//@desc  create a post
//aceess  private
router.post('/',[Auth,[
  check("text",'text is required').not().isEmpty()
]], async (req, res) => {
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  try{
    //get user details dor user data
    const user =await User.findById(req.user.id).select('-password');
    //create new post object
    const newPost= new Post({
      text:req.body.text,
      name:user.name,
      avatar:user.avatar,
      user:user.id
    });
    const posts =await newPost.save();
    res.json(posts);

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }
  
});

//@route  GET api/posts
//@desc  get all post
//aceess  private
router.get("/",Auth,async(req,res)=>{
  try{
    const posts=await Post.find().sort({date:-1});
    res.json(posts);
    

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }

});

//@route  GET api/posts/:id
//@desc  get post by id
//aceess  private
router.get("/:id",Auth,async(req,res)=>{
  try{
    //const post mean singularity single post onley so i define like post
    const post=await Post.findById(req.params.id);
    //check post exist
    if(!post){
      return res.status(400).json({msg:"post not found"});
    }
    res.json(post);
    

  }catch(err){
    console.log(err.message);
    if(err.kind==='ObjectId'){
      return res.status(400).json({msg:"post not found"});
    }
    res.status(500).send("server error")
  }

});

//@route DELETE api/posts/:id
//@desc  delete post by id
//aceess  private
router.delete("/:id",Auth,async(req,res)=>{
  try{
    //const post mean singularity single post onley so i define like post
    const post=await Post.findById(req.params.id);
    //check post exist
    if(!post){
      return res.status(400).json({msg:"post not found"});
    }

    // to check login user is equal to the post posted user
    // post pota user ala mattum tha ppst aa delele pananum
    // post.user is object so we convert toSting() , req.user.id is string 
    if(post.user.toString()!==req.user.id){
      return res.status(400).json({msg:"user not authorized"});
    }
   
    await post.remove();
     res.json("post removed");
  }catch(err){
    console.log(err.message);
    if(err.kind==='ObjectId'){
      return res.status(400).json({msg:"post not found"});
    }
    res.status(500).send("server error")
  }

});

//@route put api/posts/like/:id
//@desc  create like post
//aceess  private
router.put('/like/:id',Auth,async(req,res)=>{
  try{
    const post= await Post.findById(req.params.id);
      //check if the post is alreasdy liked
      if( post.likes.filter(like=>like.user.toString()===req.user.id).length >0){
        return res.status(400).json({msg:"post is already liked"});
      }
      post.likes.unshift({user:req.user.id});
      await post.save();
      res.json(post.likes);

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }

});

//@route put api/posts/unlike/:id
//@desc  unlike a post
//aceess  private
router.put('/unlike/:id',Auth,async(req,res)=>{
  try{
    const post= await Post.findById(req.params.id);
      //check if the post is alreasdy liked
      if( post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
        return res.status(400).json({msg:"post has not yet liked"});
      }
      //create remove index
      const removeIndex= post.likes.map(like=>like.user).indexOf(req.user.id);

      post.likes.splice(removeIndex,1);
      await post.save();
      res.json(post.likes);

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }

});

//@route  POST api/posts/comment/:id
//@desc  comment a post
//aceess  private
router.post('/comment/:id',[Auth,[
  check("text",'text is required').not().isEmpty()
]], async (req, res) => {
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  try{
    //get user details dor user data
    const user =await User.findById(req.user.id).select('-password');
    const post =await Post.findById(req.params.id);

    //create new comment json
    const newComment= {
      text:req.body.text,
      name:user.name,
      avatar:user.avatar,
      user:user.id
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }
  
});
//@route DELETE api/posts/comment/:id/:comment_id
//@desc  remove comment in a post
//aceess  private
//here :id define a post id
router.delete('/comment/:id/:comment_id',Auth,async(req,res)=>{
  try{
    console.log("1");
    const post= await Post.findById(req.params.id);
      //pull out   comment  
      console.log(post);
      console.log(req.params.comment_id);
      const comment=await post.comments.find(comment=>comment.id.toString() ===req.params.comment_id);
      console.log("nbew");
      console.log(comment);
      //check comment is exist
      if(!comment){
        return res.status(400).json({msg:"no comment is exist"});
        
      }
      console.log("3");
      //check the auth user
      if(!comment.user.toString()!==req.user.id){
        return res.status(400).json({msg:"user not authorised"});
        
      }
      console.log("4");
      //create remove index
      const removeIndex= post.comments.map(comment=>comment.user).indexOf(req.user.id);
      console.log("5");

      post.comments.splice(removeIndex,1);
      await post.save();
      res.json(post.comments);

  }catch(err){
    console.log(err.message);
    res.status(500).send("server error")
  }

});

module.exports = router;
