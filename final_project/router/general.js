const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      res.json("registration successful");
    } else {
      res.status(403).json({ err: "username already exists" });
    }
  } else {
    res.status(403).json({ err: "username and/or password is not provided" });
  }
});

const getAllBooks = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
};

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const books = await getAllBooks();
  res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[req.params.isbn]);
    }, 1500);
  });
  p2.then((isbnReqBook) => {
    res.json(isbnReqBook);
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author === req.params.author
      );
      resolve(filteredBooks);
    }, 1500);
  });
  p3.then((filteredBooks) => {
    res.json(filteredBooks);
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const p4 = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title === req.params.title
      );
      resolve(filteredBooks);
    }, 1500);
  });
  p4.then((filteredBooks) => {
    res.json(filteredBooks);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbnReqBook = books[req.params.isbn];
  res.json(isbnReqBook.reviews);
});

module.exports.general = public_users;
