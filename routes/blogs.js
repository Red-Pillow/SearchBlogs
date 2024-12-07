const express = require("express");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");

const router = express.Router();


function isAuthenticated(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login"); 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/login"); 
    }
    req.userId = decoded.id; 
    next();
  });
}


router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("index", { blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).send("An error occurred while fetching blogs.");
  }
});


router.get("/create", isAuthenticated, (req, res) => {
  res.render("createBlog"); 
});


router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.userId,
    });
    await newBlog.save();
    res.redirect("/blogs"); 
  } catch (err) {
    console.error("Error creating blog:", err.message);
    res.status(500).send("Error creating blog");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comments");
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("blogDetails", { blog });
  } catch (err) {
    console.error("Error fetching blog details:", err.message);
    res.status(500).send("An error occurred while fetching the blog details.");
  }
});


router.post("/search", async (req, res) => {
  try {
    const query = req.body.query;
    if (!query) {
      return res.redirect("/blogs");
    }


    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });

    res.render("index", { blogs });
  } catch (err) {
    console.error("Error during search:", err.message);
    res.status(500).send("An error occurred while searching for blogs.");
  }
});


router.post("/comments/:blogId", isAuthenticated, async (req, res) => {
  try {
    console.log("Received comment:", req.body);
    const { content } = req.body;
    const blogId = req.params.blogId;


    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }


    console.log(content);
    const newComment = new Comment({
      content,
      author: req.userId, 
      blog: blogId,     
    });


    await newComment.save();


    blog.comments.push(newComment._id);
    await blog.save();


    res.status(200).json(newComment);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).send("An error occurred while adding the comment.");
  }
});

module.exports = router;
