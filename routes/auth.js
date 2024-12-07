const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const router = express.Router();


router.use(cookieParser());

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password , email} = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists. Please login.");
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).send("An error occurred during registration.");
  }
});

router.get("/auth/check", (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
  }
  try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ message: "Authenticated" });
  } catch (err) {
      res.clearCookie("jwt");
      return res.status(401).json({ message: "Unauthorized" });
  }
});




router.get("/logout", (req, res) => {

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "Strict" });

    res.redirect("/login");
  });



router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials.");
    }


    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials.");
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


    res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.redirect("/blogs");
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("An error occurred during login.");
  }
});


module.exports = router;
