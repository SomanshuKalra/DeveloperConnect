const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//Import User model
const User = require("../../models/User");

// @route   GET api/auth
// @desc    Test route for auth
// @access  Public
router.get("/", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Unauthorized to access" });
  }
});

// @route   POSt api/auth/login
// @desc    Login request for user. Authenticate user and get token.
// @access  Public

router.post(
  "/login",
  [
    check("email", "Invalid email") //Input validations for email
      .isEmail()
      .exists(),
    check("password", "Password is required").exists() //Input validations for password
  ],
  async (req, res) => {
    const { email, password } = req.body;

    //Get the results of request validation and check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email }); //Check if user exists
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      //Compare userid and password
      const ismatch = await bcrypt.compare(password, user.password);
      if (!ismatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      //Create payload and sign jwt token
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
          return res.json({ token: token });
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
module.exports = router;
