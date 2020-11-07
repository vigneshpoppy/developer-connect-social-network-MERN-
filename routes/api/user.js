const express = require('express');

const router = express.Router();
const User = require('../../models/User');
var gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//condig requirw for jwt-key because jwt key is placed in that file
const config = require('config');

// @route post api/user
//@desc  user registration
//@acces public

router.post(
  '/',
  [
    // username check
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email should be in correct format').isEmail(),
    // password must be at least 5 chars
    check('password', 'Password should be more than 6 character').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
      //check user exixst
      let user = await User.findOne({ email });
      if (user) {
        // res.status(400).send('User Already Exist');
        res.status(400).json({ errors: [{ msg: 'user is already exist' }] });
      }
      // console.log('ji');
      else {
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'dg',
          d: 'mm',
        });
        // console.log('gh');
        user = new User({
          name,
          email,
          avatar,
          password,
        });
        // console.log(user);
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        //jwt payload
        const payload = {
          user: {
            id: user.id,
          },
        };
        //jwt init
        jwt.sign(
          payload,
          config.get('jwttoken'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        // res.send('user registered');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;
