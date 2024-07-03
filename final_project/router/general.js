const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const userName = req.body.username;
  const passWord = req.body.password;
  if(!userName){
    return res.status(300).json({message: "username not provided"});
  }
  if(!passWord){
    return res.status(300).json({message: "password not provided"});
  }
  const existingUsers = users.filter((user)=>{return user[userName] === userName;})
  if(existingUsers.length === 0){
    users.push({"userName":userName,"passWord":passWord});  
    res.send(`user ${userName} registered!\n`);
  }
  else{
    return res.status(300).json({message: "username already exists"});}
});

let getList = new Promise((resolve,reject)=>{
  resolve(JSON.stringify(books, null, 4));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getList.then((message)=>{
    res.send("from promise:"+message);
  });
  res.send(JSON.stringify(books, null, 4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let getBook = new Promise((resolve,reject)=>{
    if(isbn && books[isbn]){
    
      resolve(books[isbn]);
      //res.send(books[isbn]);
    }
    else{
      reject("Book not found");
   }});
  getBook.then((message)=>{
    res.send(message);
  }).catch((message)=>{
    res.status(404).json(message);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  let bookList = [];
  let getBook = new Promise((resolve,reject)=>{
    for(var i = 0; i< keys.length; i++){
      if(books[keys[i]]["author"] === author){
        bookList.push(books[keys[i]]);
      }
    }
    if(bookList.length === 0){
      reject("not found");
    }
    else{
      resolve((bookList));
    }
    
  });
  getBook.then((message)=>{
    res.send(message);
  }).catch((message)=>{
    res.status(404).json({message: message});
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  let bookList = [];
  let getBook = new Promise((resolve,reject)=>{
    for(var i = 0; i< keys.length; i++){
      if(books[keys[i]]["title"] === title){
        bookList.push(books[keys[i]]);
      }
    }
    if(bookList.length === 0){
      reject("not found");
    }
    else{
      resolve(bookList);
    }
    
  });
  getBook.then((message)=>{
    res.send(message);
  }).catch((message)=>{
    res.status(404).json({message: message});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn && books[isbn]){
    res.send(books[isbn]["reviews"]);
  }
  else{
    return res.status(404).json({message: "Book not found\n"});}
 });

module.exports.general = public_users;
