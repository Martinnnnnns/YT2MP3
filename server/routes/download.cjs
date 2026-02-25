const express = require('express');
const router = express.Router();
const path = require('path');
const youtubeService = require('../services/youtube.cjs');

/**
 * POST /api/download
 * Downloads YouTube video and converts to MP3
 * Body: { url: string, quality: string }
 */
router.post('/', async (req, res) => {
  const { url, quality } = req.body;

  // Validate request
  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  try {
    console.log(`Download request - URL: ${url}, Quality: ${quality}`);

    // Download and convert audio
    const result = await youtubeService.downloadAudio(url, quality);

    // Sanitize title for filename
    const sanitizedTitle = youtubeService.sanitizeFilename(result.title);
    const downloadFilename = `${sanitizedTitle}.mp3`;

    console.log(`Download complete - File: ${result.filePath}`);

    // Send file to client
    res.download(result.filePath, downloadFilename, async (err) => {
      // Clean up temporary file after download completes
      await youtubeService.deleteFile(result.filePath);

      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to send file' });
        }
      }
    });

  } catch (error) {
    console.error('Download error:', error.message);

    // Return appropriate error status
    const statusCode = error.message.includes('Invalid') ? 400 : 500;
    res.status(statusCode).json({
      error: error.message
    });
  }
});

module.exports = router;
