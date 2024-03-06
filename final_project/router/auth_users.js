const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // If username and password are valid, create a JWT token and send it in the response
  const token = jwt.sign({ username: username }, 'secretKey', { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
  
    // Check if the user is authenticated
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalid" });
      }
  
      const username = decoded.username;
  
      // Check if the user has already reviewed the book
      const existingReviewIndex = books.findIndex(book => book.isbn === isbn && book.reviews.some(r => r.username === username));
  
      if (existingReviewIndex !== -1) {
        // Modify the existing review
        const existingReview = books[existingReviewIndex].reviews.find(r => r.username === username);
        existingReview.review = review;
      } else {
        // Add a new review
        const newReview = { username: username, review: review };
        const bookIndex = books.findIndex(book => book.isbn === isbn);
  
        if (bookIndex !== -1) {
          books[bookIndex].reviews.push(newReview);
        } else {
          return res.status(404).json({ message: "Book not found" });
        }
      }
  
      return res.status(200).json({ message: "Review added/modified successfully" });
    });
  });

  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    // Check if the user is authenticated
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalid" });
      }
  
      const username = decoded.username;
  
      // Filter and delete the reviews based on the session username
      const bookIndex = books.findIndex(book => book.isbn === isbn);
  
      if (bookIndex !== -1) {
        books[bookIndex].reviews = books[bookIndex].reviews.filter(review => review.username !== username);
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
