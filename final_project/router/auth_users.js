const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if(username){
    return (users.filter((user)=>{return user.userName === username}).length > 0);
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(password){
    return (users.filter((user)=>{return (user.userName === username) && (user.passWord === password)}).length > 0);
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(isValid(username)){
    if(authenticatedUser(username,password)){
      let token = jwt.sign({data:password},'access',{expiresIn: 60*60});
      req.session.authorization = {token,username};
      return res.status(200).send("User successfully logged in");
    }
  }
  return res.status(300).json({message: "Wrong username/passwords"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;
  if(books[isbn]){
    (books[isbn].reviews)[username] = review;
    res.send("review added!");
  }
  else{
    return res.status(300).json({message: "Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.username;
  if(books[isbn]){
    delete (books[isbn].reviews)[username];
    res.send("review deleted!");
  }
  else{
    return res.status(300).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
