const connection = require("../DB/Db");
const express = require("express");
const routes = express.Router();
const { matchedData, validationResult, body } = require('express-validator');
routes.post('/sign-up', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errors = result.errors.map(err => err.msg);
        return res.json({ success: false, message: errors[0] });
    }

    const { name, email, password } = matchedData(req, { locations: ['body'] });
    try {
        const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.json({ success: false, message: 'Email Already Exists' });
        }

        await connection.query('INSERT INTO user SET ?', { name, email, password });
        res.status(201).json({ success: true, message: 'SignUp Successfully' });
    } catch (err) {
        console.error('Error adding User:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



routes.post('/login', [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const error = result.errors.map(message => message.msg);
        return res.json({ success: false, message: error[0] });
    }

    const { email, password } = matchedData(req, { locations: ['body'] });

    try {
        // Query to find user by email
        const [rows] = await connection.query('SELECT id,name,email FROM user WHERE email = ? and password=?', [email,password]);

        if (rows.length === 0) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const user = rows[0];
        res.json({ success: true, message: 'Login Successful' ,user});
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


  

module.exports = routes;