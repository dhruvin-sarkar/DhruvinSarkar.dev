# PlayStation 1 ROMs

Place your PS1 ROM files (.bin, .iso, .img, .cue, etc.) in this directory.

Then edit `manifest.json` to add entries like:

```json
{
  "id": "final-fantasy-vii",
  "title": "Final Fantasy VII",
  "file": "Final Fantasy VII.bin"
}
```

The PlayStation 1 emulator uses the Mednafen PSX HW core for best compatibility.

## Requirements
- ROM files (.bin, .iso, .img, .cue)
- .cue files if your ROM is in .bin/.cue format
