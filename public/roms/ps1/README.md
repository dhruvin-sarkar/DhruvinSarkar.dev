# PlayStation 1 ROM Manifest

PlayStation 1 ROM binaries do not belong in this repository.

This folder should only contain lightweight metadata such as:

- `manifest.json`
- optional cover art assets

Actual PS1 game files must be stored in the private Cloudflare R2 bucket and
served through the ROM proxy Worker.

USA PlayStation 1 launches in this project also require a Worker-backed BIOS
URL for `SCPH-5501`, configured in
`src/components/apps/emulators/romLibraryConfig.js`.

## Manifest shape

```json
{
  "system": "ps1",
  "roms": [
    {
      "id": "tekken-3",
      "title": "Tekken 3",
      "file": "https://<worker-subdomain>.workers.dev/ps1/tekken-3.chd",
      "cover": "/assets/covers/ps1/tekken-3.jpg"
    }
  ]
}
```

`file` must always point at the Cloudflare Worker proxy URL, never a direct R2
URL and never a local repository path.

The BIOS object should also live behind the Worker, for example:

`https://<worker-subdomain>.workers.dev/bios/scph5501.bin`
