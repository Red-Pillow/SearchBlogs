const express = require("express");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const router = express.Router();


router.post("/:blogId", async (req, res) => {
    console.log("we are in add a comment in comments.js")
    console.log(req.body.content)
  const comment = new Comment({
    content: req.body.content,
    author: req.user.id,
    blog: req.params.blogId,
  });
  await comment.save();

  const blog = await Blog.findById(req.params.blogId);
  blog.comments.push(comment);
  await blog.save();

  res.redirect(`/blogs/${req.params.blogId}`);
});

module.exports = router;
