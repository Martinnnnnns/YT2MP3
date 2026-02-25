# YT2MP3 - Project Documentation

## Overview

YT2MP3 is a local YouTube to MP3 converter with a modern React frontend and Express backend, packaged as a native macOS desktop application using Tauri. It allows users to download YouTube videos as high-quality MP3 files directly to their computer without any external services.

The app can run in two modes:
1. **Native Desktop App** (Tauri) - Standalone .app bundle for macOS
2. **Web Browser Mode** - Traditional web app accessed via browser

## Architecture

### Tech Stack

**Desktop Layer:**
- Tauri 2.0 - Native app framework (Rust)
- Spawns and manages Node.js backend server
- ~10MB app size (vs ~150MB for Electron)

**Frontend:**
- React 18.3 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui for styling
- React Query for state management
- React Router for navigation

**Backend:**
- Node.js with Express (CommonJS modules)
- yt-dlp CLI wrapper for YouTube downloads
- FFmpeg for audio conversion

## Project Structure

```
yt2mp3/
├── src/                          # React frontend source
│   ├── components/               # React components
│   │   ├── ConverterCard.tsx    # Main converter UI
│   │   ├── QualitySelector.tsx  # Quality selection component
│   │   ├── WaveformAnimation.tsx # Loading animation
│   │   └── ui/                  # shadcn/ui components
│   ├── pages/                   # Route pages
│   │   ├── Index.tsx            # Home page
│   │   └── NotFound.tsx         # 404 page
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities
│   ├── App.tsx                  # App root component
│   └── main.tsx                 # Entry point
├── server/                      # Express backend (CommonJS)
│   ├── app.cjs                  # Server setup
│   ├── routes/                  # API routes
│   │   └── download.cjs         # Download endpoint
│   └── services/                # Business logic
│       └── youtube.cjs          # yt-dlp wrapper
├── src-tauri/                   # Tauri desktop app
│   ├── src/                     # Rust source code
│   │   ├── main.rs              # Entry point
│   │   └── lib.rs               # Backend server manager
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri configuration
│   ├── build.rs                 # Build script
│   ├── icons/                   # Application icons
│   └── target/                  # Compiled Rust & app bundles
│       └── release/bundle/macos/  # Built .app
├── downloads/                   # Temporary download storage
├── dist/                        # Built frontend (generated)
├── public/                      # Static assets
├── index.html                   # Vite entry HTML
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
├── package.json                 # Dependencies and scripts
└── CLAUDE.md                    # This file
```

## API Specification

### POST /api/download

Downloads a YouTube video and converts it to MP3.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "quality": "320" | "192" | "128"
}
```

**Quality Values:**
- `"320"` - High quality (320 kbps) - ~7-10 MB per song
- `"192"` - Medium quality (192 kbps) - ~4-6 MB per song (recommended)
- `"128"` - Low quality (128 kbps) - ~3-4 MB per song

**Response:**
- Success: Binary MP3 file with `Content-Disposition` header
- Error: JSON with `{ error: string }` and appropriate status code

**Status Codes:**
- 200: Success
- 400: Invalid URL format
- 500: Download/conversion failed

## Development Workflow

### Initial Setup

```bash
# Install system dependencies (macOS)
brew install node yt-dlp ffmpeg

# Install Rust (for Tauri, if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install npm dependencies
npm install
```

### Development Mode

**Option 1: Desktop App Development (Recommended)**

```bash
# Run Tauri in dev mode (launches app window with hot-reload)
npm run tauri:dev
# This automatically starts the frontend (port 8080) and backend (port 3000)
```

**Option 2: Browser Development**

Run frontend and backend separately for web development:

```bash
# Terminal 1 - Frontend dev server (with HMR)
npm run dev
# Runs on http://localhost:8080

# Terminal 2 - Backend server
npm run dev:server
# Runs on http://localhost:3000
```

**Note:** In development, the frontend (port 8080) makes API calls to the backend (port 3000) via Vite's proxy configuration.

### Production Build

**Option 1: Native Desktop App**

```bash
# Build the macOS app bundle
npm run tauri:build

# The app will be created at:
# src-tauri/target/release/bundle/macos/YT2MP3.app

# Double-click the .app file to run!
```

**Option 2: Web Server**

```bash
# Build frontend for production
npm run build

# Start backend server (serves built frontend)
npm start
# Runs on http://localhost:3000
```

### Scripts Reference

**Desktop App:**
- `npm run tauri:dev` - Run desktop app in development mode (hot-reload)
- `npm run tauri:build` - Build native macOS app bundle
- `npm run tauri` - Direct access to Tauri CLI

**Web Development:**
- `npm run dev` - Start Vite dev server (frontend only, port 8080)
- `npm run dev:server` - Start backend with nodemon (port 3000)
- `npm run build` - Build frontend to dist/
- `npm run preview` - Preview production build
- `npm start` - Start production server (serves dist/)
- `npm run start:full` - Build and start in one command

**Testing & Quality:**
- `npm run lint` - Lint frontend code
- `npm test` - Run frontend tests
- `npm run test:watch` - Run tests in watch mode

## Code Conventions

### Frontend

1. **Component Structure:**
   - Use functional components with TypeScript
   - Place reusable UI components in `src/components/ui/`
   - Place feature components in `src/components/`
   - Place page components in `src/pages/`

2. **Styling:**
   - Use Tailwind CSS utility classes
   - Use shadcn/ui components for consistency
   - Custom styles go in `App.css` or `index.css`
   - Use `cn()` utility from `@/lib/utils` for conditional classes

3. **State Management:**
   - Use React hooks (useState, useEffect, etc.) for local state
   - Use React Query for server state
   - Props for component communication

4. **Type Safety:**
   - Define types/interfaces for all data structures
   - Avoid `any` type
   - Use proper TypeScript generics

### Backend

1. **Module System:**
   - Backend uses CommonJS (require/module.exports)
   - Frontend uses ES modules (import/export)

2. **Error Handling:**
   - Always use try-catch in async routes
   - Return user-friendly error messages
   - Log detailed errors to console

3. **File Organization:**
   - Routes handle HTTP concerns
   - Services handle business logic
   - Keep routes thin, services fat

## Tauri Desktop App Architecture

### How It Works

The Tauri desktop app wraps the web frontend in a native macOS window and manages the Node.js backend server:

1. **App Launch**: User double-clicks `YT2MP3.app`
2. **Rust Layer**: Tauri's Rust code executes `lib.rs`
3. **Backend Spawn**: `start_backend_server()` spawns `node server/app.cjs`
4. **Frontend Load**: Tauri loads the frontend from `dist/`
5. **API Communication**: Frontend makes requests to `localhost:3000`
6. **Auto Cleanup**: Backend process is killed when app closes

### Key Files

- `src-tauri/src/lib.rs` - Main Tauri logic, spawns backend
- `src-tauri/tauri.conf.json` - App configuration (name, window size, bundled resources)
- `src-tauri/Cargo.toml` - Rust dependencies

### Bundled Resources

The app bundles the following in the `.app`:
- `server/` directory (all .cjs files)
- Essential node_modules (express, uuid)
- Frontend build (dist/)

System dependencies (yt-dlp, ffmpeg, Node.js) must be installed separately.

### Development vs Production

| Environment | Frontend | Backend Path |
|-------------|----------|--------------|
| Development | `localhost:8080` (Vite) | `../server/app.cjs` (project dir) |
| Production | Bundled in app | `Resources/server/app.cjs` (inside .app) |

## Important Notes

### Quality Parameter Mapping

The backend accepts quality values in two formats for backwards compatibility:

**Frontend format (kbps):** `"320"`, `"192"`, `"128"`
**Legacy format:** `"high"`, `"medium"`, `"low"`

Both map to yt-dlp quality parameters:
- 320/high → 0 (best quality)
- 192/medium → 5 (balanced)
- 128/low → 9 (smaller files)

### Security Considerations

1. **Local-only server:** Backend binds to 127.0.0.1 only
2. **URL validation:** Strict regex prevents command injection
3. **Filename sanitization:** Removes special characters
4. **Automatic cleanup:** Deletes temp files after download
5. **No external API keys:** Uses yt-dlp's public scraping

### Temporary Files

- Downloads are stored in `downloads/` with unique UUIDs
- Files are automatically deleted after successful transfer
- Failed downloads may leave orphaned files (should be rare)

### Legal Compliance

This tool is for personal, educational use only. Users are responsible for:
- Complying with YouTube's Terms of Service
- Respecting copyright laws
- Obtaining permission for copyrighted content

## Building and Managing the Desktop App

### Clean Build
```bash
# Full clean build (recommended after major changes)
cd src-tauri
cargo clean
cd ..
npm run tauri:build

# Output location:
# src-tauri/target/release/bundle/macos/YT2MP3.app
# src-tauri/target/release/bundle/dmg/YT2MP3_1.0.0_aarch64.dmg
```

### Incremental Rebuild
```bash
# Fast rebuild (only recompiles changed code)
npm run tauri:build

# First build: ~5-10 minutes (compiles all Rust dependencies)
# Subsequent builds: ~30 seconds (cached dependencies)
```

### Deleting Build Artifacts
```bash
# Remove compiled app (frees ~500MB)
rm -rf src-tauri/target/release

# Remove ALL build artifacts including Rust cache (frees ~2GB)
rm -rf src-tauri/target

# Remove from Applications folder
rm -rf "/Applications/YT2MP3.app"
```

### Customizing the App Icon

The default Tauri icon can be replaced with custom artwork:

**Icon Files Location:** `src-tauri/icons/`

**Required Files:**
- `icon.png` - Base icon (512x512 or 1024x1024)
- `icon.icns` - macOS icon bundle (generated from PNG)
- `32x32.png` - Small size
- `128x128.png` - Standard size
- `128x128@2x.png` - Retina display

**Quick Method:**
1. Create/find 1024x1024 PNG icon
2. Use https://icon.kitchen to generate all sizes
3. Replace files in `src-tauri/icons/`
4. Run `npm run tauri:build`

**Manual Generation (macOS):**
```bash
# Using sips and iconutil (built into macOS)
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
# ... (see ICON_GUIDE.md for full commands)
iconutil -c icns icon.iconset -o src-tauri/icons/icon.icns
```

**See [ICON_GUIDE.md](ICON_GUIDE.md) for complete icon customization guide.**

### Distribution

**For Personal Use:**
- Copy `.app` to Applications folder
- Or use the DMG installer

**For Sharing:**
1. Share the `.dmg` file
2. Recipients need: Node.js, yt-dlp, ffmpeg
3. First launch requires right-click → Open (Gatekeeper)

**For Public Distribution (Advanced):**
1. Code signing with Apple Developer certificate
2. Notarization via Apple
3. Create signed DMG installer
4. Optional: Submit to Mac App Store

### Build Configuration

Key files that control the build:

- `src-tauri/tauri.conf.json` - App name, version, window size, bundled resources
- `src-tauri/Cargo.toml` - Rust dependencies
- `package.json` - npm scripts and frontend dependencies
- `vite.config.ts` - Frontend build settings

## Common Development Tasks

### Adding a New Component

1. Create component file in `src/components/`
2. Use TypeScript for props and state
3. Follow existing naming conventions
4. Export as default

### Modifying the API

1. Update route handler in `server/routes/download.js`
2. Update service logic in `server/services/youtube.js`
3. Update frontend API calls in `src/components/ConverterCard.tsx`
4. Test with both frontend and backend running

### Updating Dependencies

```bash
# Update all dependencies
npm update

# Update specific dependency
npm install package@latest

# Check for outdated packages
npm outdated
```

### Debugging

**Frontend:**
- Use React DevTools browser extension
- Check browser console for errors
- Use `console.log()` liberally during development

**Backend:**
- Check terminal output for errors
- Use `console.log()` in routes/services
- Test API endpoints with curl or Postman:
  ```bash
  curl -X POST http://localhost:3000/api/download \
    -H "Content-Type: application/json" \
    -d '{"url":"https://youtube.com/watch?v=...", "quality":"192"}'
  ```

## Troubleshooting

### "yt-dlp not found"
```bash
brew install yt-dlp
```

### "ffmpeg not found"
```bash
brew install ffmpeg
```

### Port 3000 already in use
Change PORT in `server/app.js` or kill the process using port 3000

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check CORS configuration if added
- Verify API_URL in `src/components/ConverterCard.tsx`

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

1. **Frontend:**
   - Vite provides fast HMR and optimized builds
   - React Query handles caching automatically
   - Code splitting is automatic with React Router

2. **Backend:**
   - Files are streamed, not loaded into memory
   - Automatic cleanup prevents disk bloat
   - yt-dlp is highly optimized

## Future Enhancement Ideas

- [x] Desktop app packaging (Tauri) ✅
- [ ] Download history/queue management
- [ ] Batch download support
- [ ] Playlist support
- [ ] Progress bar during download
- [ ] Multiple audio formats (AAC, OGG, FLAC)
- [ ] Video metadata display (thumbnail, title, duration)
- [ ] Dark/light theme toggle
- [ ] Windows and Linux builds (Tauri supports cross-platform)
- [ ] Auto-update functionality
- [ ] Custom download location picker
