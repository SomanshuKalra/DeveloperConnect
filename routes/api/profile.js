const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

//Load profile model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get profile of the logged in user.
// @access  Public
router.get("/me", authMiddleware, async (req, res) => {
  try {
    //Fetching profile details from database
    console.log(req.user);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ error: "Profile not available" });
    }

    res.status(200).json({ profile: profile });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   POST api/profile/
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    //Check for required params in the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build the profile object
    let profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //Build social fields object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    //Save the data to database
    try {
      //Find the profile if already exists
      //let profile = await Profile.findOne({ user: req.user.id });

      //Update the profile if found or create a profile if not found.

      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      if (profile) return res.status(200).json(profile);
      return res
        .status(400)
        .json({ error: "Unable to create or update profile" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: error.message });
    }
  }
);

// @route   GET api/profile/
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "avatar",
      "email"
    ]);
    if (!profiles)
      return res.status(400).json({ error: "No profiles created yet!" });
    return res.status(200).json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get specific user profile using userId
// @access  Public

router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      ["name", "avatar", "email"]
    );
    if (!profile) return res.status(400).json({ error: "Profile not found" });

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId")
      return res.status(400).json({ error: "Profile not found" });
    return res.status(500).json({ error: "Interal server error" });
  }
});

// @route   DELETE api/profile
// @desc    Delete user profile, user and posts
// @access  Private

router.delete("/", authMiddleware, async (req, res) => {
  //@todo - remove user's posts
  //Deleting user profile
  try {
    await Profile.findOneAndRemove({ user: req.user.id });

    //Removing user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Interal server error" });
  }
});

// @route   PUT api/profile/experience
// @desc    Add user's experience to its profile details
// @access  Private

router.put(
  "/experience",
  [
    authMiddleware,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("fromDate", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //Check for validation errors
    console.log("checking errors");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors encountered");

      return res.status(400).json({ errors: errors.array() });
    }
    console.log("no errors");
    //Deconstruct request to fetch form fields
    const {
      title,
      company,
      location,
      fromDate,
      toDate,
      current,
      description
    } = req.body;

    //Create new exprience object
    const newExp = {
      title,
      company,
      location,
      fromDate,
      toDate,
      current,
      description
    };

    try {
      //Find user profile
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(400).json({ error: "Profile not found" });

      //Ad user experience to profile
      profile.experience.unshift(newExp);

      //Save profile
      await profile.save();
      return res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// @route   DELETE api/profile/experience/:experienceId
// @desc    Delete user's specific experience from its profile details
// @access  Private

router.delete("/experience/:experienceId", authMiddleware, async (req, res) => {
  try {
    //Fetch user profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(400).json({ error: "Profile not found" });

    //Finding index of particular experience to be removed
    const removeIndex = profile.experience
      .map(experience => experience.id)
      .indexOf(req.params.experienceId);

    //Removing experience from profile object
    profile.experience.splice(removeIndex, 1);

    //Save profile
    await profile.save();

    //Return profile in response
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   PUT api/profile/education
// @desc    Add user's education details to its profile details
// @access  Private

router.put(
  "/education",
  [
    authMiddleware,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //Check for validation errors
    console.log("checking errors");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors encountered");

      return res.status(400).json({ errors: errors.array() });
    }
    console.log("no errors");
    //Deconstruct request to fetch form fields
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    //Create new exprience object
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      //Find user profile
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(400).json({ error: "Profile not found" });

      //Add user's education to profile
      profile.education.unshift(newEdu);

      //Save profile
      await profile.save();
      return res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// @route   DELETE api/profile/education/:educationId
// @desc    Delete user's specific education from its profile details
// @access  Private

router.delete("/education/:educationId", authMiddleware, async (req, res) => {
  try {
    //Fetch user profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(400).json({ error: "Profile not found" });

    //Finding index of particular education to be removed
    const removeIndex = profile.education
      .map(education => education.id)
      .indexOf(req.params.educationId);

    //Removing education from profile object
    profile.education.splice(removeIndex, 1);

    //Save profile
    await profile.save();

    //Return profile in response
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   GET api/profile/github/:githubUsername
// @desc    Get user's repo from github
// @access  Public

router.get("/github/:githubUsername", async (req, res) => {
  try {
    //Define an options object to make request to fetch github repos
    const options = {
      uri: `https://api.github.com/users/${
        req.params.githubUsername
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    //Make request to fetch github profile
    request(options, (err, response, body) => {
      if (err)
        return res.status(404).json({ error: "No github profile found" });
      if (response.statusCode !== 200) {
        return res.status(404).json({ error: "No github profile found" });
      }

      //Send response if github profile fetched
      res.status(200).json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
