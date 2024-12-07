const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const router = express.Router();

// Middleware to use cookies
router.use(cookieParser());

// Register Route
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password , email} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists. Please login.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).send("An error occurred during registration.");
  }
});

// Logout route
router.get("/logout", (req, res) => {
    console.log("we are in /logout route")
    // Clear the JWT token by setting the cookie's expiration date to a time in the past
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "Strict" });
  
    // Redirect the user to the login page or home page after logout
    res.redirect("/login"); // You can change this to the desired route, like '/'
  });


// Login Route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials.");
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials.");
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set JWT as an HTTP-only cookie
    res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.redirect("/blogs");
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("An error occurred during login.");
  }
});


module.exports = router;
