require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Single declaration

const app = express();
const PORT = process.env.PORT || 5000;

// Consolidated CORS configuration (moved to top)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Critical!
}));

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Connect to MongoDB
console.log('MONGODB_URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const projectRoutes = require('./routes/project');
app.use('/api/projects', projectRoutes);

const ticketRoutes = require('./routes/ticket');
app.use('/api/tickets', ticketRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Sorry, can't find that!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
