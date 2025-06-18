# Instagram Reels Auto Scroller

An automatic scrolling extension for Instagram Reels that intelligently detects when videos end and automatically scrolls to the next reel.

## 🎯 Features

- **Automatic Scrolling**: Automatically scrolls to the next reel when the current video ends
- **Smart Video Detection**: Intelligently identifies the currently playing video in view
- **Customizable Timing**: Configurable delay after video ends before scrolling
- **Manual Controls**: Keyboard shortcuts for manual control and testing
- **Debug Mode**: Comprehensive logging and debugging information
- **Visual Notifications**: Instagram-themed notifications for status updates
- **Fail-safe Timeout**: Maximum wait time to prevent getting stuck on any video

## 🚀 Installation

### Method 1: Browser Extension (Recommended)

**Step-by-step instructions to load the extension:**

#### For Chrome:
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"** button
4. Select the folder containing your extension files (manifest.json, content.js, etc.)
5. The extension should now appear in your extensions list
6. Make sure it's **enabled** (toggle should be blue/on)

#### For Edge:
1. Open Edge and go to `edge://extensions/`
2. Enable **Developer mode** (toggle in left sidebar)
3. Click **"Load unpacked"** button
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list
6. Make sure it's **enabled**

#### For Firefox:
1. Open Firefox and go to `about:debugging`
2. Click **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on"**
4. Select the `manifest.json` file from your extension folder
5. The extension will be loaded temporarily (until Firefox restart)

#### Verification:
1. Navigate to `instagram.com/reels`
2. Open browser console (F12)
3. Look for the message: `✅ Instagram Auto Scroller Fixed Version loaded!`
4. You should see the initialization messages in the console

### Method 2: Userscript
1. Install a userscript manager like Tampermonkey or Greasemonkey
2. Create a new userscript and paste the code
3. Save and enable the script

### Method 3: Browser Console (Temporary)
1. Open Instagram Reels page
2. Open browser developer tools (F12)
3. Paste the code in the console and press Enter
