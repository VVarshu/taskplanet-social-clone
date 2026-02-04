const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  likePost,
  commentPost,
} = require("../controllers/postController");

// multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// routes
router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/", getPosts);
router.post("/like/:id", authMiddleware, likePost);
router.post("/comment/:id", authMiddleware, commentPost);

module.exports = router;
