const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const usersWithSameName = users.filter((user) => user.username === username);
    return usersWithSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const foundUsers = users.filter((user) => user.username === username && user.password === password);
    return foundUsers.length > 0;
  
}
  //write code to check if username and password match the one we have in records.


//only registered users can login
regd_users.post("/login", (req,res) => {
  
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data:password}, "access", {expiresIn: 60 * 60});
      req.session.authorization = {accessToken,username};
      return res.status(200).send("User successfully logged in!");
  }
  else {
      return res.status(208).json({message: "Invalid credentials"});
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review added successfully");
    }
    else {
        return res.status(404).json({message: `book with ISBN ${isbn} not found`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review deleted successfully");
  }
  else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;