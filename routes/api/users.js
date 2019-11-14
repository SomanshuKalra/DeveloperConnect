const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//Import User model
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register users
// @access  Public
router.post(
  "/register",
  //Request validation rules
  [
    check("name", "Name is required.")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check(
      "password",
      "Please enter a valid password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    try {
      //Get the results of request validation and check for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Errors in validation, returning errors");
        return res.status(400).json({ errors: errors.array() });
      }

      //Check if user already exists

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Email already registered." });
      }

      //Grab gravatar image of the registered user
      const avatar = gravatar.url(email, {
        s: "200", //size of the image
        r: "pg", //rating of image 'pg' - parental guidance
        d: "mm" //returns a default image is gravatar is unavailable for the email id
      });

      //Create a new user model if no error in the request
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Hash the password before saving the model
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save the user to the database
      await user.save();

      //Log in the user and create JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (err) {
      console.log("in catch block");
      console.log(err.message);
      let user = await User.findOne({ email });
      if (user) {
        console.log("user found, deleting");
        await user.remove(err => {
          if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
          }
        });
      }
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
