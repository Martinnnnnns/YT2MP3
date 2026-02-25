const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class YouTubeService {
  constructor() {
    this.downloadsDir = path.join(__dirname, '../../downloads');
  }

  /**
   * Validates YouTube URL format
   * @param {string} url - YouTube URL to validate
   * @returns {boolean} - True if valid YouTube URL
   */
  validateUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  }

  /**
   * Sanitizes filename to prevent issues
   * @param {string} filename - Original filename
   * @returns {string} - Sanitized filename
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_')      // Replace spaces with underscores
      .substring(0, 100);        // Limit length
  }

  /**
   * Maps quality setting to yt-dlp audio quality parameter
   * @param {string} quality - Quality setting (320, 192, 128 or high, medium, low)
   * @returns {string} - yt-dlp quality parameter (0-9)
   */
  getQualityParameter(quality) {
    const qualityMap = {
      // New format (kbps values from frontend)
      '320': '0',
      '192': '5',
      '128': '9',
      // Legacy format (for backwards compatibility)
      'high': '0',
      'medium': '5',
      'low': '9'
    };
    return qualityMap[quality] || '5'; // Default to medium (192 kbps)
  }

  /**
   * Downloads and converts YouTube video to MP3
   * @param {string} url - YouTube video URL
   * @param {string} quality - Audio quality (320, 192, 128 or high, medium, low)
   * @returns {Promise<Object>} - Object with filePath and metadata
   */
  async downloadAudio(url, quality = '192') {
    // Validate URL
    if (!this.validateUrl(url)) {
      throw new Error('Invalid YouTube URL format');
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const outputTemplate = path.join(this.downloadsDir, `${uniqueId}.%(ext)s`);
    const qualityParam = this.getQualityParameter(quality);

    return new Promise((resolve, reject) => {
      const args = [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', qualityParam,
        '--no-playlist',
        '--output', outputTemplate,
        '--print', 'after_move:filepath',
        '--print', 'title',
        url
      ];

      const ytdlp = spawn('yt-dlp', args);

      let outputData = '';
      let errorData = '';
      let title = '';
      let filepath = '';

      ytdlp.stdout.on('data', (data) => {
        const output = data.toString().trim();
        outputData += output + '\n';

        // Capture output lines
        const lines = output.split('\n');
        if (lines.length >= 2) {
          filepath = lines[lines.length - 1];
          title = lines[lines.length - 2];
        }
      });

      ytdlp.stderr.on('data', (data) => {
        errorData += data.toString();
        console.log('yt-dlp:', data.toString());
      });

      ytdlp.on('close', (code) => {
        if (code === 0) {
          // Parse the output to get the actual file path
          const outputLines = outputData.trim().split('\n');
          const actualFilePath = outputLines[outputLines.length - 1];
          const videoTitle = outputLines[outputLines.length - 2] || 'audio';

          resolve({
            filePath: actualFilePath,
            title: videoTitle,
            quality: quality
          });
        } else {
          // Parse error messages for user-friendly feedback
          let errorMessage = 'Download failed';

          if (errorData.includes('Private video') || errorData.includes('members-only')) {
            errorMessage = 'This video is private or members-only';
          } else if (errorData.includes('Video unavailable')) {
            errorMessage = 'This video is unavailable or has been removed';
          } else if (errorData.includes('network')) {
            errorMessage = 'Network error. Please check your internet connection';
          } else if (errorData.includes('Sign in')) {
            errorMessage = 'This video requires authentication';
          }

          reject(new Error(errorMessage));
        }
      });

      ytdlp.on('error', (error) => {
        if (error.code === 'ENOENT') {
          reject(new Error('yt-dlp not found. Please install it using: brew install yt-dlp'));
        } else {
          reject(new Error(`Failed to start download: ${error.message}`));
        }
      });
    });
  }

  /**
   * Deletes a file
   * @param {string} filePath - Path to file to delete
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`Deleted temporary file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error.message);
    }
  }
}

module.exports = new YouTubeService();
