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

- Live Chat

![Live Chat](https://github.com/dhruvin-sarkar/Win95P-DevPortfolio/blob/main/src/assets/msn.gif?raw=true)

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
- Resize window
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
- Added MSN
  - Live chat app connected to backend Node, Express and MongoDB (free server is slow sometimes)
  - Chat is live and has expiration key each session to prevent spam
  - Added filter words
  - Added auto delete for spams on the server side
- Added MineSweeper
  - Flag can now be placed on desktop
- Added Settings
  - Wallpaper can now be changed
  - Theme will also be changed along with wallpaper
- Added Run command
  - Now Run command is fully functioned
  - Added Error handling when type in the wrong file name
- Added new drag and drop feature
  - Now every icon can be drag and drop to any folder
  - Fixed bug where dragging out of folder causes other icons to flow in different direction by adding key to its container to rearrange (re-mount) the container
  - Icons will now be saved in user localStorage
- Added notification when page loaded
  - Display message and running animation
- Added MSN notification
  - Notification will pop up when there is a new message when MSN is hidden or closed
- Now MSN live chat is using websocket instead of API for better performance
  - Added Reconnecting websocket, reconnect chat after user navigates away and comes back
- Added Icon size adjustable on the icon next to the clock on footer
- Added Calendar by clicking the time on the footer
- Added sub folder on start menu imitating real Windows 95 functionality
- Added Bitcoin price real-time tracking display and icon celebrating BTC hits $100k
  - User can hide/unhide in tab bar
  - Using Coinbase websocket to display
- Added Effect pattern in settings
- Added My Computer and working on file system
- Added Right Click and still working on more functions
  - On Desktop uses right click
  - On mobile uses long press
  - Right click can be done on icon now
- Added Right click on each icon and icon in bin
  - Right clicking on icon now able to open and delete
  - After icon being deleted, it will move to RecycleBin
  - Right click on icon in RecycleBin will show option to restore
  - Clicking on restore will store the icon to its previous position
- Added Paint using Library [Paint](https://github.com/1j01/jspaint)
- Added AiAgent project
- Added News icon on task bar
  - Can display latest news by clicking on the article
  - Connected to back-end
- Added Temperature on news App
  - Can detect user's location
  - Able to switch between Celsius and Fahrenheit
- Added Patch App
- Now weather prediction can track user's local time
- Added Weather 🌙 sticker when it's night time
- Added color picker to Settings for background customization
- Added 3D Object in Project folder
- Added AI Chat Bot to MSN app
- Chat Bot is able to be switched on/off
- Added Tile grid App **Inspired from Windows 10 and Windows phone**
- Added fetching background from tile screen mode with toggle on/off
- Added Icons on Tile screen
- Added Reconnect to MSN chat
- Added Task Manager APP
- Add bitcoin chart
- Re-design BTC widget
- Add MSN nudge sound effect
  - Send nudge to server and broadcast to all clients
  - Nudge shakes the chat window
- Added sorting icon right click
  - Each folder's icons can be sorted by name
- Added toggleable Google Search bar
- Added confirmation before permanently delete file
- Added Store icon
- All the apps in Store are now free to install
- All the apps that being installed or uninstalled are now being added or removed on Tile as well
- All apps are now able to install and uninstall in the store
- Now icon will be added and deleted dynamically, and width will be adjusted automatically
- New icon will be able to be added on the footer bottom right corner
- Enhanced Bio Folder with consistent tab styling and new "Being Employed" section
  - Updated technology stack with categorized sections
  - Improved tab formatting with consistent CSS classes
  - Added employment experience section with professional content
- DOOM Game Integration
  - Fully playable DOOM game with js-dos emulator
  - Fullscreen mode with proper 4:3 aspect ratio maintenance
  - Enhanced maximize button functionality for true fullscreen experience
  - Automatic letterboxing with black bars for authentic retro display
  - Improved canvas scaling and display optimization
  - Removed redundant fullscreen button for cleaner interface

## Library Used

- React Draggable => drag and drop functionality
- Framer-motion => for some animation
- Webamp => Winamp music player (for music app)
- npm i react-calendar => for calendar

## Credits

All the Windows 95 icons and others can be found here:
[Old Windows Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095)

Special thanks to whoever owns this website.

To Do:
win 95 inside win 95 using a emulator iframe
comick iframe 
steam iframe
Solitaire
snake
tetris
browser i frame
 Full Nintendo 64 Emulator 

Use mupen64plus-ui-console compiled to WebAssembly
Run actual N64 ROMs (Mario 64, Zelda OoT)
Public domain ROMs to avoid legal issues
Save states, controller mapping
"Super Mario 64 running in a Windows 95 window" = INSTANT viral
Shows: WebAssembly, emulation, low-level programming understanding
Libraries: mupen64plus, compiled with Emscripten
2. PlayStation 1 Emulator 

PCSX-ReARMed in WebAssembly
Run actual PS1 games (Crash Bandicoot, FF7)
Memory card saves
"PS1 in Win95" is chef's kiss
Shows: Console emulation, 3D graphics
Libraries: pcsx-rearmed compiled to WASM
3. Game Boy / Game Boy Color / Game Boy Advance 

Multiple emulators in one window
Switch between systems
Pokemon Red/Blue, Link's Awakening, etc.
Link cable emulation (trade Pokemon between instances!)
Shows: Multiple system emulation
Libraries: mGBA, SameBoy compiled to WASM
4. Sega Genesis/Mega Drive

Run Sonic, Streets of Rage
Save states, rewind feature
Shows: 16-bit emulation
Libraries: BlastEm or Genesis Plus GX
5. NES Emulator

Super Mario Bros, Contra, Metroid
More lightweight than N64
Easier to implement but still impressive
Shows: 8-bit emulation fundamentals
Libraries: JSNES (pure JavaScript!)
6. Quake Full 3D FPS

Original Quake engine in WebAssembly
Full 3D, multiplayer capable
"Quake running in Windows 95 window in browser"
Shows: 3D game engines, networking
Libraries: Quake.js (exists!), QuakeSpasm compiled to WASM
 Wolfenstein 3D 

Predecessor to DOOM, raycasting engine
Easier than full 3D but still impressive
Shows: Raycasting, retro 3D
Libraries: Wolf4SDL compiled to WASM
