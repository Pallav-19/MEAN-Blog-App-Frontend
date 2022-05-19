const Post = require("../../models/post.js");
const editPost = (req, res) => {
  const id = req.params.id;
  Post.findOneAndUpdate(
    { _id: id },
    { title: req.body.title, content: req.body.content }
  )
    .then((responseData) => {
      res.json({ message: "post updated successfully" });
      console.log(responseData);
    })
    .catch((err) => {
      console.log(`an error ${err} occured`);
    });
};
module.exports = editPost;
