const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Root route - serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for file analysis
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.json({ error: 'No file uploaded' });
    }

    // Return file metadata
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });

  } catch (error) {
    res.json({ error: 'File processing error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'File Metadata Microservice is running',
    timestamp: new Date().toISOString()
  });
});

// Handle all other routes - serve HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server configuration
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`File Metadata Microservice running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;