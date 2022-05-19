const Post = require("../../models/post.js");

const getPost = (req, res, next) => {
  Post.find().then((foundData) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: foundData,
    });
  });
};
module.exports = getPost;
