const express = require("express");
const router = express.Router();
const {
  addPost,
  getPost,
  deletePost,
  editPost,
} = require("../controllers/post/posts.controller.js");

router.post("", addPost);

router.get("", getPost);

router.delete("/:id", deletePost);

router.patch("/:id", editPost);

module.exports = router;
