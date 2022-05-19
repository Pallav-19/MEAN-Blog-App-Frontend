const Post = require("../../models/post.js");

const addPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post
    .save()
    .then((post) => {
      console.log(`The Post ${post} was saved`);
      res.status(200).json({
        message: `The Post ${post} was saved`,
        resultId: post._id,
      });
    })
    .catch((err) => {
      console.log(`An Error ${err} occured.`);
    });
};
module.exports = addPost
