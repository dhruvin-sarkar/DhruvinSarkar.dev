# Emulator & Games Suite Summary

## Added Apps (12)

1. **Windows 95**
- Component: `src/components/apps/emulators/WindowsXPWin95.jsx`
- Tech: Virtual x86 (`v86`) inside iframe launcher
- Launcher: `public/emulators/win95.html`
- Requirement: Add `public/emulators/win95.img`

2. **Nintendo 64**
- Component: `src/components/apps/emulators/NintendoN64.jsx`
- Tech: EmulatorJS iframe loader
- Launcher: `public/emulators/ejs-loader.html?core=n64`
- ROM: user-provided via picker or `?rom=` query

3. **PlayStation 1**
- Component: `src/components/apps/emulators/PlayStation1.jsx`
- Tech: EmulatorJS iframe loader (`mednafen_psx_hw`)
- Launcher: `public/emulators/ejs-loader.html?core=ps1`
- ROM: user-provided
- Note: PS1 core path falls back to EmulatorJS CDN

4. **Game Boy Advance**
- Component: `src/components/apps/emulators/GameBoyAdvance.jsx`
- Tech: EmulatorJS iframe loader (`mgba`)
- Launcher: `public/emulators/ejs-loader.html?core=gba`
- ROM: user-provided

5. **NES Emulator**
- Component: `src/components/apps/emulators/NESEmulator.jsx`
- Tech: EmulatorJS iframe loader (`fceumm`)
- Launcher: `public/emulators/ejs-loader.html?core=nes`
- ROM: user-provided

6. **Commander Keen 4**
- Component: `src/components/apps/emulators/CommanderKeen4.jsx`
- Tech: js-dos (CDN runtime) inside iframe
- Launcher: `public/emulators/keen4.html`
- Requirement: user `.jsdos/.zip/.exe`, or `public/games/commanderkeen/keen4.jsdos`

7. **Space Cadet Pinball**
- Component: `src/components/apps/emulators/SpaceCadet.jsx`
- Tech: hosted web build in iframe
- URL: `https://pinball.alula.me/`

8. **Quake III Arena**
- Component: `src/components/apps/emulators/Quake3Arena.jsx`
- Tech: hosted web build in iframe
- URL: `https://lrusso.github.io/Quake3/`

9. **Quake (Original)**
- Component: `src/components/apps/emulators/QuakeOriginal.jsx`
- Tech: hosted QuakeJS iframe
- URL: `https://www.quakejs.com/`

10. **Chrome Dino**
- Component: `src/components/apps/emulators/ChromeDino.jsx`
- Tech: self-hosted game files in iframe
- Files: `public/games/dino/*`
- Entry: `public/games/dino/index.html`

11. **DX-Ball**
- Component: `src/components/apps/emulators/DXBall.jsx`
- Tech: iframe wrapper + runtime script from Dustin Brett host
- Entry: `public/games/dxball/index.html`

12. **SkiFree**
- Component: `src/components/apps/emulators/SkiFree.jsx`
- Tech: hosted web port in iframe
- URL: `https://basicallydan.github.io/skifree.js/`

## Shared Infrastructure

- `src/components/apps/shared/useEmulatorWindow.jsx`
  - iframe loading state
  - 10s timeout + retry handling
- `src/components/apps/shared/EmulatorLoadingScreen.jsx`
  - themed loading UI variants
- `src/components/apps/shared/AppWindowShell.jsx`
  - standardized app-window wrapper integration with existing OS context
- `src/components/apps/shared/RetroIframeApp.jsx`
  - reusable iframe-app component with:
    - load/error overlays
    - external open fallback
    - optional performance warning modal
- Styles: `src/css/RetroEmulatorWindow.css`

## Public Assets/Launchers Added

- EmulatorJS data: `public/emulators/emulatorjs/data/*`
- EmulatorJS universal loader: `public/emulators/ejs-loader.html`
- Virtual x86 assets:
  - `public/emulators/v86/libv86.js`
  - `public/emulators/v86/v86.wasm`
  - `public/emulators/v86/bios/seabios.bin`
  - `public/emulators/v86/bios/vgabios.bin`
- Win95 launcher: `public/emulators/win95.html`
- Commander Keen launcher: `public/emulators/keen4.html`
- Dino files: `public/games/dino/*`
- DX-Ball page: `public/games/dxball/index.html`
- Icons: `public/icons/*.svg` (12 icons)

## OS Integration

- `src/App.jsx`
  - imports + renders all 12 new apps
  - adds state objects and context entries
  - registers apps in `ObjectState()` for `handleShow()` compatibility
- `src/icon.json`
  - adds desktop icon entries for all 12 apps
- `src/components/function/AppFunctions.js`
  - maps new icon names to `public/icons/*.svg`
- `src/components/Footer.jsx`
  - adds Start menu launch entries for all 12 apps

## Error Handling & UX Included

- 10-second iframe load timeout
- retry and "Open Externally" actions
- performance warning gate for Win95 and Quake III
- EmulatorJS ROM picker with drag/drop and file input
- EmulatorJS floating buttons for ROM picker + gamepad guidance
- ROM 404 guard in EmulatorJS loader (`HEAD` check)

## Known Limitations

- PS1 core assets may rely on EmulatorJS CDN depending on local core availability.
- Windows 95 cannot boot without `public/emulators/win95.img`.
- Hosted embeds (Space Cadet/Quake/SkiFree) can break if upstream hosts change URLs or frame policies.
- DX-Ball currently loads runtime from an external host script in `public/games/dxball/index.html`.
