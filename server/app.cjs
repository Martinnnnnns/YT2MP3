const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const downloadRouter = require('./routes/download.cjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes (must be before static files to avoid conflicts)
app.use('/api/download', downloadRouter);

// Serve static files from React build (dist directory)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server (bind to localhost only for security)
app.listen(PORT, '127.0.0.1', () => {
  console.log(`YouTube to MP3 Converter running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
