const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");

//Import Posts, User and Profile model
const Posts = require("../../models/Posts");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post(
  "/",
  [
    authMiddleware,
    [
      check("text", "Text is required")
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

    try {
      //Find user details using id
      const user = await User.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({
          error: "Invalid session. Please login with your email and password"
        });

      //Create an object for new post
      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      //Save the post object in DB
      const post = await newPost.save();
      if (!post)
        return res
          .semd(400)
          .json({ error: "Unable to add post. Please try again" });

      return res.status(200).json(post);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private

router.get("/", authMiddleware, async (req, res) => {
  try {
    //Fetch all posts
    const posts = await Posts.find().sort({ date: -1 });
    if (!posts)
      return res
        .status(400)
        .json({ error: "Unable to fetch posts. Please try again later" });

    //Return the fetched posts
    res.status(200).json(posts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   GET api/posts/:post
// @desc    Get post by post id
// @access  Private

router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    //Find a post by id
    const post = await Posts.findById(req.params.postId).sort({ date: -1 });
    if (!post)
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });

    //Return the post in response
    return res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   DELETE api/posts/:post
// @desc    Delete post by post id
// @access  Private

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    //Fetch post by id
    const post = await Posts.findById(req.params.postId);
    if (!post)
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });

    //Check if the post to be deleted is added by the logged in user or not
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Not authorized to delete this post" });
    }

    //Delete the post
    await post.remove();
    return res.status(200).json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   PUT api/posts/likes/:id
// @desc    Add likes to a post
// @access  Private

router.put("/likes/:id", authMiddleware, async (req, res) => {
  try {
    //Fetch post by id
    const post = await Posts.findById(req.params.id);
    if (!post)
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });

    //Check if the post has been liked by the user or not

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    //Add new like to the object
    post.likes.unshift({ user: req.user.id });

    //Save post object to DB
    await post.save();

    //Return JSON response to the front end
    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Remove likes to a post
// @access  Private

router.put("/unlike/:id", authMiddleware, async (req, res) => {
  try {
    //Fetch post by id
    const post = await Posts.findById(req.params.id);
    if (!post)
      return res
        .status(400)
        .json({ error: "Post not found. Please try again later" });

    //Check if the post has been liked by the user or not

    if (
      (post.likes.filter(
        like => like.user.toString() === req.user.id
      ).length = 0)
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    //Get index of the like
    const likeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(likeIndex, 1);

    //Save post object to DB
    await post.save();

    //Return JSON response to the front end
    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// @route   POST api/posts/comment/:id
// @desc    Add new comment to a post
// @access  Private

router.post(
  "/comment/:id",
  [
    authMiddleware,
    [
      check("text", "Text is required")
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

    try {
      //Find user details using id
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.id);
      if (!user)
        return res.status(400).json({
          error: "Invalid session. Please login with your email and password"
        });
      if (!post)
        return res.status(400).json({
          error: "Post not found. Please try again later"
        });

      //Create an object for new comment
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      //Add the comment to the post
      post.comments.unshift(newComment);

      //Save the post object in DB
      await post.save();
      return res.status(200).json(post.comments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// @route   DELETE api/posts/comment/:postId/:commentId
// @desc    Delete a comment from a post
// @access  Private

router.delete(
  "/comment/:postId/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      //Find user details using id
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.postId);
      if (!user)
        return res.status(400).json({
          error: "Invalid session. Please login with your email and password"
        });
      if (!post)
        return res.status(400).json({
          error: "Post not found. Please try again later"
        });

      //Fetch comment from the post
      const comment = post.comments.find(
        comment => comment.id === req.params.commentId
      );

      //Check if comment fetched
      if (!comment) {
        return res.status(404).json({ error: "Comment does not exist" });
      }

      //Check if the comment is made by the logged in user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({
          error: "Comment not made by logged in user, unable to delete"
        });
      }

      //Get index of comment to be removed
      const commentIndex = post.comments
        .map(comment => comment.id.toString())
        .indexOf(req.params.commentId);

      //Remove the comment from the post
      post.comments.splice(commentIndex, 1);

      await post.save();

      return res.status(200).json(post.comments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
