const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();
mongoose
  .connect(
    "mongodb+srv://mean-app:mean-app@pallav.njiyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("mongoose connected ");
  })
  .catch((err) => {
    console.log(` an error occured : ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post
    .save()
    .then((post) => {
      console.log(`The Post ${post} was saved`);
    })
    .catch((err) => {
      console.log(`An Error ${err} occured.`);
    });
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((foundData) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: foundData,
    });
  });
});

app.delete("/api/posts/:id", (req, res) => {
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
});
module.exports = app;
