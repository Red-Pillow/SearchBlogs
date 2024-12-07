const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


const User = require("./models/User");
const Blog = require("./models/Blog");
const Comment = require("./models/Comment");


function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}


app.get("/", (req, res) => res.redirect("/register"));

app.use("/", require("./routes/auth")); 
app.use("/blogs", authenticateToken, require("./routes/blogs")); 
app.use("/comments", authenticateToken, require("./routes/comments")); 


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
