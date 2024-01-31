const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.find((user) => user.username === username) ? false : true;
};

const authenticatedUser = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password
  )
    ? true
    : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, "access", {
        expiresIn: 60 * 30, //half hour
      });
      req.session.authorization = { accessToken: token };
      res.json("login successful");
    } else {
      res
        .status(403)
        .json({ err: "User does not exist. Kindly register first to login" });
    }
  } else {
    res.status(403).json({ err: "username and/or password is not provided" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  books[isbn].reviews[req.user.username] = review;
  res.json(books[isbn]);
});
//delete a  book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  delete books[isbn].reviews[req.user.username];
  res.json(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
