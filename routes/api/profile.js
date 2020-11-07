const express = require('express');
const router = express.Router();
//middle ware fro auth
const Auth = require('../../middleware/Auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//validaton
const { check, validationResult } = require('express-validator');


//@route  get api/profile/me
//@desc   login users profile
//aceess  private

router.get('/me', Auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(401).json({ msg: 'profile not found for this user' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send('server error');
  }
});
//@route  post api/profile
//@desc   create and update users profile
//aceess  private


router.post(
  '/',
  [
    Auth,
    [  
      // chek status
    check('status', 'status is must').not().isEmpty(),
    
    check('skills', 'skills is required').not().isEmpty(),]],
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }
      const company=req.body.company;
      const website=req.body.website;
      const location=req.body.location;
      const bio=req.body.bio;
      const status=req.body.status;
      const githubusername=req.body.githubusername;
      const skills=req.body.skills;
      const youtube=req.body.youtube;
      const twitter=req.body.twitter;
      const facebook=req.body.facebook;
      const linkedin=req.body.linkedin;
      const instagram=req.body.instagram;

      //build profile object
      const profileFields={};
      profileFields.user=req.user.id;
      if(company) profileFields.company=company;
      if(location) profileFields.location=location;
      if(website) profileFields.website=website;
      if(bio) profileFields.bio=bio;
      if(status) profileFields.status=status;
      if(githubusername) profileFields.githubusername=githubusername;
      if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim())
      }

      //build social object
      profileFields.social={}
      if(youtube) profileFields.social.youtube=youtube;
      if(twitter) profileFields.social.twitter=twitter;
      if(linkedin) profileFields.social.linkedin=linkedin;
      if(facebook) profileFields.social.facebook=facebook;
      if(instagram) profileFields.social.instagram=instagram;
      try{
          let profile = await Profile.findOne({user:req.user.id});
          if(profile){

            //update
            profile =await Profile.findOneAndUpdate(
              {user:req.user.id},
              {$set:profileFields},
              {new:true});

              //display
             return  res.json(profile)

              
          }
          //create profile if no profile exist
         profile= new Profile(profileFields);
         await profile.save();
         res.json(profile);
          

      }catch(err){
        res.status(500).send("server error");
      }

  });


//@route  get api/profile
//@desc  get all profiles
//aceess  public
router.get('/',async (req,res)=>{
  try{
   const profiles=await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);
  }catch(err){
    console.log(err.message);
    res.status(500).send("server error");
  }
 


});



//@route  get api/profile/user/:user_id
//@desc  get  profile by user id
//aceess  public
router.get('/user/:user_id',async (req,res)=>{
  try{
   const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
   if(!profile){
     return res.status(400).json({msg:"profile not found"});
   }
    res.json(profile);
  }
  catch(err){

    console.log(err.message);

    if(err.kind=='ObjectId'){
      return res.status(400).json({msg:"profile not found"});
    }
    
    res.status(500).send("server error");
  }

});




//@route  delete api/profile
//@desc  delete  profile,user and post
//aceess  private
router.delete('/',Auth,async (req,res)=>{
  try{
    //delete profile
   await Profile.findOneAndRemove({user:req.user.id});
   //delete user
   await User.findOneAndRemove({_id:req.user.id});
    res.json({msg:"user is deleted"});
  }catch(err){
    console.log(err.message);
    res.status(500).send("server error");
  }
 
});



//@route  put api/profile/experience
//@desc  add experience profiles
//aceess  private
router.put(
  '/experience',
  [
    Auth,
    [  
      // chek validation pf correct format data
    check('title', 'title is must').not().isEmpty(),
    
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),]],
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }
      // console.log(req.body.from);
      const company=req.body.company;
      const title=req.body.title;
      const location=req.body.location;
      const from=req.body.from;
      const current=req.body.current;
      const to=req.body.to;
      const description=req.body.description;
    //  console.log("1");
      const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
      }
    //  console.log("2");

      try{
        const profile= await Profile.findOne({user:req.user.id});
        // console.log("3");
        // console.log(profile);
       profile.experience.unshift(newExp);
        // console.log("4");
        await profile.save();
        res.json(profile);

      }catch(err){
        console.log(err.message);
        res.status(500).send("server error")
      }

    });


    //@route  DELETE api/profile/experience/:exp_id
    //@desc  Delete experience by experience id
    //aceess  private
    router.delete('/experience/:exp_id',Auth,async(req,res)=>{
     // console.log("1");
      try{
        const profile= await Profile.findOne({user:req.user.id});
        console.log("2");
        //removeIndex
        const removeIndex= profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

      }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
      }
     
    });

    //@route  put api/profile/education
     //@desc  add education in profiles
     //aceess  private
router.put(
  '/education',
  [
    Auth,
    [  
      // chek validation pf correct format data
    check('school', 'school is must').not().isEmpty(),
    check('degree', 'company is required').not().isEmpty(),
    check('fieldofstudy', 'field of study is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),]],
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }
      // console.log(req.body.from);
      const school=req.body.school;
      const degree=req.body.degree;
      const fieldofstudy=req.body.fieldofstudy;
      const from=req.body.from;
      const current=req.body.current;
      const to=req.body.to;
      const description=req.body.description;
    //  console.log("1");
      const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      }
    //  console.log("2");

      try{
        const profile= await Profile.findOne({user:req.user.id});
        // console.log("3");
        // console.log(profile);
       profile.education.unshift(newEdu);
        // console.log("4");
        await profile.save();
        res.json(profile);

      }catch(err){
        console.log(err.message);
        res.status(500).send("server error")
      }

    });
    
    //@route  DELETE api/profile/education/:edu_id
    //@desc  Delete education by education id
    //aceess  private
    router.delete('/education/:edu_id',Auth,async(req,res)=>{
      // console.log("1");
      try{
        const profile= await Profile.findOne({user:req.user.id});
        // console.log("2");
        //removeIndex
        const removeIndex= profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

      }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
      }
     
    });


module.exports = router;
