# Win95P-DevPortfolio

Windows 95 Portfolio

Live: https://Dhruvin-Sarkar.dev

## Featured Functionality

- Log in

![Login](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/login.gif?raw=true)

- Drag and Drop

![Drag and Drop](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/dragDrop.gif?raw=true)

- Change icon size

![Icon Size](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/iconSize.gif?raw=true)

- Change background

![Background](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/bg.gif?raw=true)

- Run command

![Run Command](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/run.gif?raw=true)


- Notification

![Notification](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/Noti.gif?raw=true)

- Calendar

![Calendar](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/calendar.gif?raw=true)

- Mine Sweeper

![Mine Sweeper](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/game.gif?raw=true)

- Enhanced Bio Folder

![Bio Folder](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/bio.gif?raw=true)

- DOOM Game

![DOOM Game](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/doom.gif?raw=true)

- Shutting Down

![Shutdown](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/shutdown.gif?raw=true)

## All Functionalities

- Drag and Drop
- Shrink and Expand window
- Start Menu
- Resize window in all 8 directions from any edge or corner
  - Correct directional cursors per handle
  - Transparent overlay during resize prevents iframes swallowing mouse events
  - Minimum window size enforced so windows cannot collapse beyond usability
- Hide and unhide
- One click to highlight
- Double Click to open (also works on mobile using useState to capture the first touch and counting time within 300ms)
- Introduce Clippy assistant, who always gives you inspiration speeches
- Clippy has function to show up and give you advice when you click on certain things
- Added Shutdown Button
  - Shutdown
  - Restart
  - Log out
- Added animation on Shutdown
- Added Log in page
  - Added mario animation running
  - Click on ? button can increase mario's size
  - Live chat app connected to backend Node, Express and MongoDB (free server is slow sometimes)
  - Chat is live and has expiration key each session to prevent spam
  - Added filter words
  - Added auto delete for spams on the server side
  - AI Chat Bot switchable on/off
- Added MineSweeper
  - Flag can now be placed on desktop
- Added Settings
  - Wallpaper can now be changed
  - Theme will also be changed along with wallpaper
  - Color picker for background customization
  - Effect pattern selector
- Added Run command
  - Fully functional with error handling for wrong file names
- Added new drag and drop feature
  - Every icon can be dragged and dropped to any folder
  - Fixed bug where dragging out of folder causes other icons to flow in different direction
  - Icons saved in user localStorage
- Added notification when page loaded
- Added Icon size adjustable on the icon next to the clock on footer
- Added Calendar by clicking the time on the footer
- Added sub folder on start menu imitating real Windows 95 functionality
- Added Bitcoin price real-time tracking display
  - User can hide/unhide in tab bar
  - Using Coinbase websocket to display
  - Bitcoin chart
  - Redesigned BTC widget
  - BTC hits $100k celebration icon
- Added My Computer with working file system
- Added Right Click context menu
  - Desktop right click + mobile long press
  - Right click on icon: open and delete
  - Deleted icons move to RecycleBin
  - Right click in RecycleBin: restore icon to previous position
  - Sorting icons by name per folder
- Added Paint using [jspaint](https://github.com/1j01/jspaint)
- Added AiAgent project
  - Connected to backend
  - Temperature display with location detection
  - Celsius / Fahrenheit toggle
  - Weather night sticker based on local time
  - Weather prediction tracking user's local time
- Added Patch App
- Added 3D Object in Project folder
- Added Tile grid App (inspired by Windows 10 and Windows Phone)
  - Fetchable background from tile screen with toggle on/off
  - Icons on Tile screen
- Added Task Manager App
- Added toggleable Google Search bar
- Added confirmation before permanently deleting a file
- Added Store
  - All apps free to install and uninstall
  - Install/uninstall syncs with Tile screen automatically
  - Icon added and removed dynamically, width adjusts automatically
  - Fixed silent empty render caused by missing category/description metadata
- New icon can be added on the footer bottom right corner
- Enhanced Bio Folder
  - Consistent tab styling
  - Updated technology stack with categorized sections
  - Employment experience section

---

## Emulator Suite

Full emulator suite using EmulatorJS, each system with a manifest-driven ROM library. Games launch with one click — no file prompts.

- **Nintendo 64** — ROM library with manifest card grid
- **PlayStation 1** — ROM library, ROMs hosted on Cloudflare R2 and streamed via a Cloudflare Worker proxy
  - Tekken 3, Mortal Kombat Trilogy, Gran Turismo, Metal Gear Solid, Tomb Raider
  - Silent Hill, Need for Speed III: Hot Pursuit, Grand Theft Auto, Grand Theft Auto 2, Marvel vs. Capcom, JoJo's Bizarre Adventure
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
- **Hollow Knight** — Unity WebGL, streamed from 2games.io CDN
- **ULTRAKILL** — Unity WebGL GitHub Pages port

---

## Internet Explorer

- Working address bar with URL and search query detection
- Back and forward navigation
- Bookmarks bar
- Error handling for sites that block iframe embedding

---

## Developer Tools

- **VS Code** powered by Monaco Editor
- **Terminal** with file system support
- **MS-DOS Prompt** via js-dos

---

## Library Used

- React Draggable — drag and drop functionality
- Framer Motion — animations
- Webamp — Winamp music player
- react-calendar — calendar

---

## Infrastructure

- ROMs hosted on **Cloudflare R2** 
- **Cloudflare Worker** proxy streams ROMs to the frontend with CORS headers and range request support
- Deployed on **Vercel**

---

## Credits

All the Windows 95 icons and others can be found here:
[Old Windows Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095)

Special thanks to whoever owns this website.
