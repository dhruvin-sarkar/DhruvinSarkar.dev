# Win95P-DevPortfolio

> A Windows 95-style portfolio OS built in React
---

## Overview

A fully interactive browser-based desktop environment that mimics Windows 95, built as a personal portfolio. It features a complete window management system, a suite of retro games and emulators, developer tools, live chat, and much more — all running in the browser.

---

## All Functionalities

- Drag and drop windows across the desktop
- Shrink and expand windows
- Resize windows in all 8 directions from any edge or corner
  - Correct directional cursors per handle
  - Transparent overlay during resize prevents iframes from swallowing mouse events
  - Minimum window size enforced so windows cannot collapse beyond usability
- Hide and unhide windows
- One click to highlight, double click to open
- Double click also works on mobile using useState to capture the first touch and counting time within 300ms
- Introduced Clippy assistant who gives contextual inspiration and advice when you click on certain things
- Added Shutdown Button
  - Shutdown
  - Restart
  - Log out
- Added shutdown animation
- Added Log in page
  - Mario animation running
  - Click on ? button to increase Mario's size
- Added MSN Messenger
  - Live chat app connected to backend — Node.js, Express, and MongoDB
  - Chat is live with an expiration key each session to prevent spam
  - Word filter
  - Auto delete for spam on the server side
  - AI Chat Bot switchable on/off
  - MSN nudge sound effect — sends nudge to server, broadcasts to all clients, shakes the chat window
  - Now uses WebSocket instead of polling API for better performance
  - Reconnecting WebSocket — reconnects after user navigates away and comes back
  - MSN notification pops up when there is a new message while MSN is hidden or closed
- Added Minesweeper
  - Flags can be placed on the desktop
- Added Settings
  - Wallpaper can be changed
  - Theme changes along with wallpaper
  - Color picker for background customization
  - Effect pattern selector
- Added Run command
  - Fully functional
  - Error handling when wrong file name is entered
- Added drag and drop for icons
  - Every icon can be dragged and dropped into any folder
  - Fixed bug where dragging out of a folder causes other icons to flow in different direction by re-mounting the container with a key
  - Icon positions saved in user localStorage
- Added notification on page load with message and running animation
- Added MSN notification popup when a new message arrives and MSN is hidden or closed
- Added icon size adjustable via the resolution scaler next to the clock in the footer
- Added Calendar by clicking the time on the footer
- Added sub-folders in Start Menu imitating real Windows 95 functionality
- Added Bitcoin price real-time tracking display
  - Hide/unhide from taskbar
  - Real-time price via Coinbase WebSocket
  - Bitcoin chart
  - Redesigned BTC widget
  - $100k celebration icon
- Added My Computer with working file system
- Added Right Click context menu
  - On desktop (long press on mobile)
  - Right click on icon: open and delete
  - Deleted icons move to Recycle Bin
  - Right click in Recycle Bin: restore icon to previous position
  - Sorting icons by name per folder
  - Confirmation prompt before permanently deleting a file
- Added Paint using [jspaint](https://github.com/1j01/jspaint)
- Added AI Agent project
- Added news widget on taskbar
  - Displays latest news with article links
  - Connected to backend
  - Temperature display with automatic location detection
  - Celsius / Fahrenheit toggle
  - Night mode weather sticker based on local time
  - Weather prediction tracking user's local time
- Added Patch App
- Added 3D Object in Project folder
- Added Tile grid App inspired by Windows 10 and Windows Phone
  - Fetchable background from tile screen with toggle on/off
  - Icons on tile screen
- Added Task Manager App
- Added toggleable Google Search bar on the desktop
- Added Store
  - All apps free to install and uninstall
  - Install/uninstall syncs with Tile screen automatically
  - Icons added and removed dynamically, width adjusts automatically
  - Fixed silent empty render caused by missing category/description metadata
- New icons can be added dynamically from the footer bottom right corner
- Enhanced Bio Folder
  - Consistent tab styling
  - Updated technology stack with categorized sections
  - Employment experience section
- Added VS Code powered by Monaco Editor
- Added Terminal with file system support
- Added MS-DOS Prompt via js-dos
- Added custom wallpaper support — users can set and change desktop wallpaper
- Added system sound effects for window interactions and notifications
- Expanded notification system with more contextual alerts
- Performance improvements including fewer unnecessary re-renders and better iframe handling across all apps

---

## Emulator Suite

Full emulator suite using EmulatorJS with a manifest-driven ROM library. Each system has a game card grid — games launch with one click, no file prompts.

- **PlayStation 1** — ROM library, large ROMs hosted on Cloudflare R2 and streamed via a Cloudflare Worker proxy
  - Tekken 3, Mortal Kombat Trilogy, Gran Turismo, Metal Gear Solid, Tomb Raider
  - Silent Hill, Need for Speed III: Hot Pursuit, Grand Theft Auto, Grand Theft Auto 2, Marvel vs. Capcom, JoJo's Bizarre Adventure
- **Nintendo 64** — ROM library with manifest card grid
- **Game Boy Advance** — ROM library
- **NES** — ROM library
- **Windows 95** — fully booting via Virtual x86 with performance warning
- **Nintendo 3DS** — wired with manifest system and cover art; displays "core unavailable" panel until a browser-compatible Citra core ships

---

## Games

- Space Cadet Pinball
- DOOM (js-dos)
- Quake (WebAssembly)
- Quake III Arena
- Chrome Dino
- DX-Ball
- SkiFree
- Commander Keen 4 (js-dos)
- GTA 1 (browser)
- Hollow Knight (Unity WebGL)
- ULTRAKILL (Unity WebGL)

---

## Internet Explorer

- Working address bar with URL and search query detection
- Back and forward navigation
- Bookmarks bar
- Error handling for sites that block iframe embedding

---

## Infrastructure

- Deployed on **Vercel**
- ROMs (~8.6 GB) hosted on **Cloudflare R2**
- **Cloudflare Worker** proxy streams ROMs to the frontend with CORS headers and range request support
- Live chat backend: **Node.js + Express + MongoDB**

---

## Libraries Used

- [React Draggable](https://github.com/react-grid-layout/react-draggable) — drag and drop functionality
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Webamp](https://webamp.org/) — Winamp music player
- [react-calendar](https://github.com/wojtekmaj/react-calendar) — calendar
- [jspaint](https://github.com/1j01/jspaint) — Paint app

---

## Credits

- Windows 95 icons sourced from [Old Windows Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095)
- Inspired by [**Yuteoctober**](https://github.com/Yuteoctober)
