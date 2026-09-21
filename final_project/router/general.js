const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ======================================================
// TASK 6 - Register User
// ======================================================

public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (users[username]) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users[username] = {
        password: password
    };

    res.status(201).json({
        message: "User successfully registered"
    });
});


// ======================================================
// TASK 1 - Get all books
// ======================================================

public_users.get('/', function (req, res) {

    res.send(JSON.stringify(books, null, 4));

});


// ======================================================
// TASK 2 - Get book by ISBN
// ======================================================

public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {

        res.send(JSON.stringify(books[isbn], null, 4));

    } else {

        res.status(404).send("Book not found");

    }

});


// ======================================================
// TASK 3 - Get books by Author
// ======================================================

public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const keys = Object.keys(books);

    const result = [];

    keys.forEach(function (key) {

        if (books[key].author === author) {
            result.push(books[key]);
        }

    });

    if (result.length > 0) {

        res.send(JSON.stringify(result, null, 4));

    } else {

        res.status(404).send("No books found for this author");

    }

});


// ======================================================
// TASK 4 - Get books by Title
// ======================================================

public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const keys = Object.keys(books);

    const result = [];

    keys.forEach(function (key) {

        if (books[key].title === title) {
            result.push(books[key]);
        }

    });

    if (result.length > 0) {

        res.send(JSON.stringify(result, null, 4));

    } else {

        res.status(404).send("No books found with this title");

    }

});


// ======================================================
// TASK 5 - Get reviews
// ======================================================

public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {

        res.send(JSON.stringify(books[isbn].reviews, null, 4));

    } else {

        res.status(404).send("No reviews found for this book.");

    }

});


// ======================================================
// TASK 10 - Get all books using Axios + Async/Await
// ======================================================

public_users.get('/async/books', async function (req, res) {

    try {

        const response = await axios.get(
            'http://localhost:5000/'
        );

        res.send(JSON.stringify(response.data, null, 4));

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================================================
// TASK 11 - Get book by ISBN using Axios + Async/Await
// ======================================================

public_users.get('/async/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        res.send(JSON.stringify(response.data, null, 4));

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================================================
// TASK 12 - Get books by Author using Axios + Async/Await
// ======================================================

public_users.get('/async/author/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        res.send(JSON.stringify(response.data, null, 4));

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================================================
// TASK 13 - Get books by Title using Axios + Async/Await
// ======================================================

public_users.get('/async/title/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        res.send(JSON.stringify(response.data, null, 4));

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports.general = public_users;