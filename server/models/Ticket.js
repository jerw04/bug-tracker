const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ticket', ticketSchema);
