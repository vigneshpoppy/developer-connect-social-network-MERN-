const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/Auth');
const User = require('../../models/User');

// all this are use for login--------
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//condig requirw for jwt-key because jwt key is placed in that file
const config = require('config');
//---------------

// @route get api/auth
//@desc  test route
//@acces public
router.get('/', Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.send(err.message);
    res.status(500).send('server error');
  }
});

// @route post api/auth
//@desc  user login
//@access public

router.post(
  '/',
  [
    //check email is cioresct fromat
    check('email', 'enter valid email').isEmail(),
    // password must be corect
    check('password', 'enter password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
      //check user exixst
      let user = await User.findOne({ email });
      if (!user) {
        // res.status(400).send('User Already Exist');
        res.status(400).json({ errors: [{ msg: 'invalid credential' }] });
      } else {
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
          res.status(400).json({ errors: [{ msg: 'invalid credential' }] });
        }

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
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;
