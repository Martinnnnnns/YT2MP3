# Tauri Desktop App - Setup Complete! 🎉

YT2MP3 is now configured as a **native macOS desktop application** using Tauri!

## What Was Done

### 1. Tauri Installation ✅
- Installed `@tauri-apps/cli` package
- Initialized Tauri project structure in `src-tauri/`
- Created Rust backend code to manage Node.js server

### 2. Configuration ✅
- **Window Settings**: 900x800px, centered, resizable
- **App Identity**: `com.yt2mp3.app`
- **Resources**: Backend server files bundled with app
- **Frontend Proxy**: Vite configured to proxy API calls

### 3. Backend Integration ✅
- Renamed server files to `.cjs` (CommonJS) for compatibility
- Tauri spawns `node server/app.cjs` on app launch
- Backend automatically terminated when app closes

### 4. Documentation ✅
- Updated `README.md` with desktop app instructions
- Updated `CLAUDE.md` with Tauri architecture details
- Added new npm scripts for Tauri commands

## How to Use

### Development Mode
```bash
npm run tauri:dev
```
This launches the app window with hot-reload. Changes to frontend code automatically refresh!

### Build Production App
```bash
npm run tauri:build
```
Creates `YT2MP3.app` in `src-tauri/target/release/bundle/macos/`

### First Build
⏱️ **First compilation takes 5-10 minutes** (Rust dependencies)
🚀 **Subsequent builds are much faster** (~30 seconds)

## File Structure

```
src-tauri/
├── src/
│   ├── main.rs          # Entry point
│   └── lib.rs           # Backend server manager + Tauri setup
├── Cargo.toml           # Rust dependencies
├── tauri.conf.json      # App configuration
└── target/release/bundle/macos/
    └── YT2MP3.app  # 👈 Your finished app!
```

## Key Features

✅ **Native macOS Window** - No browser, runs like a regular app
✅ **Auto Backend** - Node.js server starts/stops automatically
✅ **Small Size** - ~10MB (vs ~150MB for Electron)
✅ **Fast** - Uses native WebKit, not Chromium
✅ **Secure** - Rust backend, sandboxed environment

## System Requirements

**Runtime (for users):**
- macOS 10.13+
- Node.js (for backend server)
- yt-dlp & ffmpeg

**Development (for building):**
- All of the above, plus:
- Rust 1.77+
- Xcode Command Line Tools

## Distribution

Once built, you can:
1. Copy `YT2MP3.app` to your Applications folder
2. Share the `.app` with others (they need Node.js, yt-dlp, ffmpeg)
3. Notarize and distribute via DMG (advanced)

## Customizing the App Icon 🎨

### Quick Method (Using Online Tool)

1. **Create or find your icon image** (1024x1024px PNG recommended)
   - Simple design works best
   - Clear at small sizes
   - Music/audio theme (🎵, 🎧, headphones, waveform, etc.)

2. **Generate all icon sizes automatically:**
   - Visit: https://icon.kitchen
   - Upload your 1024x1024 icon
   - Download the generated icon pack

3. **Replace the icons:**
   ```bash
   # Copy your new icons to src-tauri/icons/
   # Make sure these files are included:
   # - icon.png (512x512 or larger)
   # - icon.icns (macOS)
   # - 32x32.png
   # - 128x128.png
   # - 128x128@2x.png
   ```

4. **Rebuild the app:**
   ```bash
   npm run tauri:build
   ```

### Manual Method (Using macOS Tools)

If you prefer to generate icons manually using built-in macOS tools:

```bash
# Create iconset folder
mkdir icon.iconset

# Generate all required sizes (starting from 1024x1024 icon.png)
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# Convert to .icns
iconutil -c icns icon.iconset -o src-tauri/icons/icon.icns

# Create the PNG versions needed
sips -z 32 32   icon.png --out src-tauri/icons/32x32.png
sips -z 128 128 icon.png --out src-tauri/icons/128x128.png
sips -z 256 256 icon.png --out src-tauri/icons/128x128@2x.png
cp icon.png src-tauri/icons/icon.png

# Clean up
rm -rf icon.iconset
```

### Icon Design Tips

**Good Icon Characteristics:**
- ✅ Simple, recognizable shape
- ✅ Works at 16x16 (very small)
- ✅ High contrast
- ✅ No thin lines or small text
- ✅ Centered composition

### Verifying Your Icon

After rebuilding, check if it worked:

```bash
# Open the app to see the new icon in the dock
open "src-tauri/target/release/bundle/macos/YT2MP3.app"
```

The new icon should appear in:
- Finder
- Dock when app is running
- Applications folder
- Spotlight search

### Icon Troubleshooting

**Icon not updating?**
1. Delete the old app from Applications
2. Clear icon cache: `sudo rm -rf /Library/Caches/com.apple.iconservices.store`
3. Rebuild: `npm run tauri:build`
4. Reinstall the app

**Icon looks blurry?**
- Use larger source image (1024x1024 minimum)
- Make sure icon.png is high resolution
- Regenerate .icns file

**Wrong icon showing?**
- macOS caches icons aggressively
- Try: `killall Dock` to restart the Dock
- Or restart your Mac

## Rebuilding & Managing

### Quick Rebuild
```bash
npm run tauri:build
# Takes ~30 seconds after first build
```

### Clean Rebuild
```bash
cd src-tauri && cargo clean && cd ..
npm run tauri:build
# Rebuilds everything from scratch
```

### Delete/Uninstall
```bash
# Remove from Applications
rm -rf "/Applications/YT2MP3.app"

# Remove build files (saves 500MB-2GB)
rm -rf src-tauri/target

# Complete reset
rm -rf src-tauri/target node_modules
npm install
```

### Build Output Location
```
src-tauri/target/release/bundle/
├── macos/YT2MP3.app       # The app
└── dmg/YT2MP3_*.dmg       # Installer
```

## Troubleshooting

**App won't open?**
- Right-click → Open (first time only, bypasses Gatekeeper)
- Ensure Node.js, yt-dlp, and ffmpeg are installed

**Build fails?**
- Check Rust installation: `rustc --version`
- Update Rust: `rustup update`
- Clean and rebuild: `cd src-tauri && cargo clean && cd .. && npm run tauri:build`

**Backend not starting?**
- Check console logs in `tauri:dev` output
- Verify `server/app.cjs` exists
- Test backend manually: `node server/app.cjs`

## Next Steps

Want to improve the app? Consider:
- Custom app icon (replace files in `src-tauri/icons/`)
- Code signing for distribution
- Auto-updater (Tauri plugin)
- Custom download folder picker
- Tray icon / menu bar mode

---

**Congrats! You now have a proper macOS app!** 🎊
