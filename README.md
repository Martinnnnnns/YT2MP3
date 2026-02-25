# YT2MP3

A modern, local YouTube to MP3 converter with a beautiful React interface. Convert YouTube videos to high-quality MP3 files directly on your computer—no external services, no data collection, completely private.

**Now available as a native macOS app!** 🎉

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Tauri](https://img.shields.io/badge/tauri-2.0-blue.svg)

## ✨ Features

- 🖥️ **Native macOS App** - Standalone desktop application (no browser needed!)
- 🎵 **High-Quality Audio** - Convert to MP3 with 128, 192, or 320 kbps
- 🎨 **Modern UI** - Beautiful, responsive React interface with Tailwind CSS
- 🔒 **100% Private** - Runs entirely on your computer, no data sent to external servers
- ⚡ **Fast Conversion** - Powered by yt-dlp and FFmpeg
- 🧹 **Auto Cleanup** - Temporary files are automatically deleted
- 🎯 **Simple** - Just paste a URL, select quality, and download
- 🪶 **Lightweight** - Only ~10MB app size thanks to Tauri

## 📸 Screenshot

```
┌─────────────────────────────────────────┐
│          🎵 YT → MP3                   │
│   Convert YouTube videos to MP3 files   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ YouTube URL                       │ │
│  │ https://youtube.com/watch?v=...  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Audio Quality                     │ │
│  │ Medium (192 kbps) - Recommended ▼ │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     📥 Download MP3               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

You can use YT2MP3 in two ways:

### Option 1: Native macOS App (Recommended) 🖥️

**Prerequisites:**
- **yt-dlp**: `brew install yt-dlp`
- **FFmpeg**: `brew install ffmpeg`
- **Node.js**: `brew install node` (required for the backend)
- **Rust**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` (only needed for building)

**Build the App:**
```bash
# Install dependencies
npm install

# Build the native macOS app
npm run tauri:build
```

The app will be created at `src-tauri/target/release/bundle/macos/YT2MP3.app`

**Run in Development:**
```bash
# Runs the app with hot-reload
npm run tauri:dev
```

Once built, double-click the `.app` file to launch! The app will run in its own window with the backend server starting automatically.

### Option 2: Web Browser Mode 🌐

**Prerequisites:**
1. **Node.js** (v18 or higher)
   ```bash
   brew install node
   ```

2. **yt-dlp** (YouTube downloader)
   ```bash
   brew install yt-dlp
   ```

3. **FFmpeg** (Audio converter)
   ```bash
   brew install ffmpeg
   ```

**Installation:**

1. **Clone or download this repository**

2. **Navigate to the project directory:**
   ```bash
   cd "Youtube to MP3 Converter"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the frontend:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 🎮 Usage

1. **Paste** a YouTube URL into the input field
2. **Select** your desired audio quality:
   - **High (320 kbps)** - Best quality, larger files (~7-10 MB per song)
   - **Medium (192 kbps)** - Recommended - Balanced quality and size (~4-6 MB per song)
   - **Low (128 kbps)** - Smaller files, acceptable quality (~3-4 MB per song)
3. **Click** "Download MP3"
4. **Wait** for the conversion (typically 10-30 seconds)
5. The MP3 file will **automatically download** to your browser's download folder

## 💻 Development

### Development Mode

For development with hot module reloading, run the frontend and backend separately:

```bash
# Terminal 1 - Frontend dev server (with HMR)
npm run dev
# Access at http://localhost:8080

# Terminal 2 - Backend API server
npm run dev:server
# Runs on http://localhost:3000
```

The frontend dev server (port 8080) will proxy API requests to the backend (port 3000).

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run tauri:dev` | **Run desktop app in development mode** |
| `npm run tauri:build` | **Build native macOS app** |
| `npm run dev` | Start Vite dev server (frontend only) |
| `npm run dev:server` | Start backend with auto-reload |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |
| `npm run start:full` | Build and start in one command |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint frontend code |
| `npm test` | Run tests |

## 📁 Project Structure

```
yt2mp3/
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── ConverterCard.tsx
│   │   ├── QualitySelector.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Route pages
│   └── App.tsx             # App root
├── server/                 # Express backend
│   ├── app.cjs             # Server setup (CommonJS)
│   ├── routes/             # API endpoints
│   │   └── download.cjs
│   └── services/           # Business logic
│       └── youtube.cjs     # yt-dlp wrapper
├── src-tauri/              # Tauri desktop app
│   ├── src/                # Rust source
│   │   └── lib.rs          # Backend server manager
│   ├── icons/              # App icons
│   └── tauri.conf.json     # Tauri configuration
├── downloads/              # Temp storage (auto-cleaned)
├── dist/                   # Built frontend
└── package.json
```

## 🔧 Configuration

### Changing the Server Port

Edit `server/app.js` and change the `PORT` constant:

```javascript
const PORT = 3000; // Change to your desired port
```

### Customizing Quality Options

Edit `src/components/ConverterCard.tsx` to add or modify quality options.

## 🌐 Supported URL Formats

The converter supports these YouTube URL formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `http://www.youtube.com/watch?v=VIDEO_ID`

## 🔄 Managing Your Desktop App

### Rebuilding the App
```bash
# Clean build (recommended after major changes)
cd src-tauri
cargo clean
cd ..
npm run tauri:build

# Quick rebuild (faster, for minor changes)
npm run tauri:build
```

### Deleting/Uninstalling
```bash
# Remove from Applications
rm -rf "/Applications/YT2MP3.app"

# Remove build artifacts (saves disk space)
rm -rf src-tauri/target

# Complete cleanup (removes all compiled Rust code)
rm -rf src-tauri/target
rm -rf node_modules
npm install  # Reinstall if you want to rebuild later
```

### Changing the App Icon
The app currently uses the default Tauri icon. To customize it:

1. Replace icons in `src-tauri/icons/` with your designs
2. Key files: `icon.png`, `icon.icns`, `32x32.png`, `128x128.png`, `128x128@2x.png`
3. Rebuild: `npm run tauri:build`

**See [ICON_GUIDE.md](ICON_GUIDE.md) for detailed instructions and icon design tips!**

### Build Artifacts Location
```
src-tauri/target/release/bundle/
├── macos/
│   └── YT2MP3.app    # The application
└── dmg/
    └── YT2MP3_1.0.0_aarch64.dmg  # Installer
```

## 🐛 Troubleshooting

### "yt-dlp not found" error
```bash
brew install yt-dlp
# or update if already installed
brew upgrade yt-dlp
```

### "FFmpeg not found" error
```bash
brew install ffmpeg
```

### "Video unavailable" error
- Video may be private, deleted, or region-restricted
- Verify the URL is correct
- Try a different video

### Port 3000 already in use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or change the port in server/app.js
```

### Frontend build fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Cannot connect to backend
- Ensure backend is running: `npm run dev:server`
- Check if port 3000 is accessible
- Verify firewall settings

## 🔒 Security & Privacy

- **Local-only:** Server binds to `127.0.0.1` (localhost only)
- **No tracking:** Zero analytics, no data collection
- **No cloud services:** Everything runs on your computer
- **URL validation:** Prevents command injection attacks
- **Auto cleanup:** Temporary files are deleted immediately after download

## ⚖️ Legal Notice

**IMPORTANT:** This tool is for personal, educational use only.

Downloading copyrighted material without permission may violate:
- YouTube's Terms of Service
- Copyright laws in your jurisdiction
- Content creators' rights

**You are solely responsible for ensuring your use complies with all applicable laws and terms of service.**

### Permitted Uses

This tool should only be used to download:
- ✅ Content you own
- ✅ Content with explicit permission from the copyright holder
- ✅ Content in the public domain
- ✅ Content under licenses that permit downloading (Creative Commons, etc.)

### Prohibited Uses

- ❌ Downloading copyrighted music without permission
- ❌ Redistributing downloaded content
- ❌ Commercial use of downloaded content
- ❌ Any use that violates YouTube's Terms of Service

## 🛠️ Technology Stack

**Desktop App:**
- Tauri 2.0 (native app framework)
- Rust (system integration)

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui (styling)
- React Query (state management)

**Backend:**
- Node.js + Express
- yt-dlp (YouTube downloader)
- FFmpeg (audio conversion)

## 📊 Quality Guide

| Quality | Bitrate | File Size | Use Case |
|---------|---------|-----------|----------|
| High | 320 kbps | ~7-10 MB | Audiophiles, archiving |
| Medium | 192 kbps | ~4-6 MB | General use (recommended) |
| Low | 128 kbps | ~3-4 MB | Saving storage space |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloader
- [FFmpeg](https://ffmpeg.org/) - Audio/video processing
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vite](https://vitejs.dev/) - Build tool

## 📧 Support

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/yourusername/yt2mp3/issues)
3. Create a new issue with details about your problem

---

**Made with ❤️ for the open-source community**
