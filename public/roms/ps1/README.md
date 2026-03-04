# PlayStation 1 ROMs

PlayStation 1 game files were too large to bundle in this repository. The emulator works, but you need to use your own PS1 ROMs.

The desktop library now supports browser uploads for single-file images and zipped packages. Use one of these formats:

- `.chd`
- `.iso`
- `.img`
- `.pbp`
- `.zip`

Raw multi-file `.cue + .bin` sets should be zipped before upload.

If you want to keep PS1 files in the repo instead of uploading them through the browser, place them in this directory and edit `manifest.json` to add entries like:

```json
{
  "id": "final-fantasy-vii",
  "title": "Final Fantasy VII",
  "file": "Final Fantasy VII.bin"
}
```

The PlayStation 1 emulator uses the Mednafen PSX HW core for best compatibility.
