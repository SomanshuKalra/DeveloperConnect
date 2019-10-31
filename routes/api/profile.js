const express = require("express");
const router = express.Router();

// @route   GET api/profile
// @desc    Test route for profile
// @access  Public
router.get("/", (req, res) => res.send("Profile route"));

module.exports = router;
