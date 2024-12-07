const express = require("express");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login"); // Redirect to login if the user is not authenticated
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/login"); // Redirect if the JWT verification fails
    }
    req.userId = decoded.id; // Attach the user ID to the request
    next();
  });
}

// Homepage showing blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("index", { blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).send("An error occurred while fetching blogs.");
  }
});

// Add Blog Form (Authenticated users only)
router.get("/create", isAuthenticated, (req, res) => {
  res.render("createBlog"); // Render the form for adding a new blog
});

// Add New Blog (Authenticated users only)
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.userId, // Save the logged-in user as the author
    });
    await newBlog.save();
    res.redirect("/blogs"); // Redirect to the blogs list after creation
  } catch (err) {
    console.error("Error creating blog:", err.message);
    res.status(500).send("Error creating blog");
  }
});

// Blog Details (Ensure this comes after create route)
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

// Search Blogs
router.post("/search", async (req, res) => {
  try {
    const query = req.body.query;
    if (!query) {
      return res.redirect("/blogs"); // If no query, redirect to the homepage
    }

    // Search for blogs by title or content
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search
        { content: { $regex: query, $options: "i" } }
      ]
    });

    res.render("index", { blogs });
  } catch (err) {
    console.error("Error during search:", err.message);
    res.status(500).send("An error occurred while searching for blogs.");
  }
});

// Add a comment to a blog
router.post("/comments/:blogId", isAuthenticated, async (req, res) => {
  try {
    console.log("Received comment:", req.body);
    const { content } = req.body;
    const blogId = req.params.blogId;

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Create a new comment using the Comment model
    console.log(content);
    const newComment = new Comment({
      content,
      author: req.userId, // Link the comment to the logged-in user
      blog: blogId,       // Link the comment to the blog
    });

    // Save the comment to the database
    await newComment.save();

    // Optionally, push this comment's ID into the blog's comments array (for easier querying)
    blog.comments.push(newComment._id);
    await blog.save();

    // Send the new comment as JSON to the client
    res.status(200).json(newComment);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).send("An error occurred while adding the comment.");
  }
});

module.exports = router;
