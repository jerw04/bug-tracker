const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const router = express.Router();

// Create ticket
router.post('/', auth, async (req, res) => {
  try {
    const { title, projectId } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project ID are required" });
    }
    
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tickets by project
// server/routes/ticket.js
router.get('/', auth, async (req, res) => {
  try {
    if (!req.query.projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    
    const tickets = await Ticket.find({ projectId: req.query.projectId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update ticket status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
