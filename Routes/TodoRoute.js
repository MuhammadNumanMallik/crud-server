const connection = require("../DB/Db");
const express = require("express");
const routes = express.Router();
const { matchedData, validationResult, body } = require('express-validator');
routes.post('/add-todo', [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required'),
    body('userid').notEmpty().withMessage('Userid is required'),
], async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const error = result.errors.map(message => message.msg);
        return res.json({ success: false, message: error[0] });
    }

    const todo = matchedData(req, { locations: ['body'] });

    try {
        await connection.query('INSERT INTO todo SET ?', [todo]);
        res.json({ success: true, message: 'Todo added successfully' });
    } catch (err) {
        console.error('Error adding todo:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

routes.get('/todo-list/:id', async (req, res) => {
  const id = req.params.id; // Retrieve id from route parameter
  
  try {
    const [result] = await connection.execute("SELECT * FROM todo WHERE userid = ?", [id]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching todo list:', error);
    res.status(500).json({ error: "Internal server error" });
  } 
});
  

  routes.post('/update-todo', [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required'),
], async (req, res) => {
    const { id } = req.body;
    const result = validationResult(req);
  try { 
    if (!result.isEmpty()) {
        const error = result.errors.map(message => message.msg);
        return res.json({ success: false, message: error[0] });
    }
    const data = matchedData(req, { locations: ['body'] });
    
    await connection.query("UPDATE todo set ? WHERE id = ?", [data,id]);
    res.json({ success: true, message: "Todo Update successfully" });
  } catch (error) {
    console.error("Error Update:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
  
  });
  routes.post('/delete-todo', async (req, res) => {
    const { id } = req.body;
  try {
    
    await connection.query("DELETE FROM todo WHERE id = ?", [id]);
    res.json({ success: true, message: "Todo Delete successfully" });
  } catch (error) {
    console.error("Error Delete:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
  
  });

module.exports = routes;