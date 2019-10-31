const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");

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

module.exports = router;
