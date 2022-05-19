const Post = require("../../models/post.js");

const deletePost = (req, res) => {
  const deleteId = req.params.id;
  Post.deleteOne({ _id: deleteId })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: `Post Deleted with ID ${deleteId}`,
      });
    })
    .catch((err) => {
      console.log("An error " + err + " occured");
    });
};
module.exports = deletePost;
