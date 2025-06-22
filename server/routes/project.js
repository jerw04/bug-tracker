const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = new Project({ title, description, teamMembers });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('teamMembers', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
