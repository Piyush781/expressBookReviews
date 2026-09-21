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
 const username = req.body.username;
    const password = req.body.password;

    // Check whether username and password were provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check whether username exists
    if (!users[username]) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Check password
    if (users[username].password !== password) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Create JWT
    const accessToken = jwt.sign(
        {
            username: username
        },
        "access",
        {
            expiresIn: "1h"
        }
    );

    // Store JWT in session
    req.session.authorization = accessToken;

    res.status(200).json({
        message: "Login successful",
        username: username,
        accessToken: accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    const token = req.session.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    jwt.verify(token, "access", function (err, decoded) {

        if (err) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const username = decoded.username;

        // Check whether book exists
        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Make sure reviews object exists
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Add or modify review
        books[isbn].reviews[username] = review;

        res.status(200).json({
            message: "Review added/updated successfully",
            review: books[isbn].reviews
        });
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const token = req.session.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    jwt.verify(token, "access", function (err, decoded) {

        if (err) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const username = decoded.username;

        // Check whether book exists
        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Check whether reviews exist
        if (!books[isbn].reviews) {
            return res.status(404).json({
                message: "No reviews found for this book"
            });
        }

        // Check whether this user has a review
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({
                message: "You have not reviewed this book"
            });
        }

        // Delete only this user's review
        delete books[isbn].reviews[username];

        res.status(200).json({
            message: "Review deleted successfully"
        });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
