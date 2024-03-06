const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Assuming 'users' is an object for storing user data
  users[username] = { username, password };
  return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('https://grigorkalajd-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');
      const books = response.data;
      return res.status(200).json({ books: JSON.stringify(books, null, 2) });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching books' });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`https://grigorkalajd-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/${isbn}`);
      const book = response.data;
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      return res.status(200).json({ book: JSON.stringify(book, null, 2) });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching book details' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const response = await axios.get(`https://grigorkalajd-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?author=${author}`);
      const authorBooks = response.data;
  
      if (authorBooks.length === 0) {
        return res.status(404).json({ message: 'Books by author not found' });
      }
  
      return res.status(200).json({ books: JSON.stringify(authorBooks, null, 2) });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching books by author' });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`https://grigorkalajd-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?title=${title}`);
      const titleBooks = response.data;
  
      if (titleBooks.length === 0) {
        return res.status(404).json({ message: 'Books with title not found' });
      }
  
      return res.status(200).json({ books: JSON.stringify(titleBooks, null, 2) });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching books by title' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const reviews = book.reviews || {};
  return res.status(200).json({ reviews: JSON.stringify(reviews, null, 2) });
});

module.exports.general = public_users;
