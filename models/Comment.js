const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true, // Ensure that the content is provided
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true // Make sure the author is a user
  },
  blog: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Blog", 
    required: true // Make sure the comment is linked to a specific blog
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Comment", commentSchema);
