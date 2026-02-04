const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const post = await Post.create({
      text,
      image: imageUrl,
      user: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed" });
  }
};


// GET ALL POSTS (FEED)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE / UNLIKE POST
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const username = req.user.username;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((user) => user !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// COMMENT ON POST
exports.commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      username: req.user.username,
      text
    });

    await post.save();

    res.status(200).json({
      message: "Comment added",
      commentsCount: post.comments.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


