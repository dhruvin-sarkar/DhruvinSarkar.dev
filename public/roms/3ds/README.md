# Nintendo 3DS ROM Manifest

Nintendo 3DS ROM binaries do not belong in this repository.

This folder should only contain lightweight metadata such as:

- `manifest.json`
- optional cover art assets

Actual 3DS game files must be stored in the private Cloudflare R2 bucket and
served through the ROM proxy Worker.

## Manifest shape

```json
{
  "system": "3ds",
  "roms": [
    {
      "id": "super-mario-3d-land",
      "title": "Super Mario 3D Land",
      "file": "https://<worker-subdomain>.workers.dev/3ds/super-mario-3d-land.3ds",
      "cover": "/assets/covers/3ds/super-mario-3d-land.jpg"
    }
  ]
}
```

`file` must always point at the Cloudflare Worker proxy URL, never a direct R2
URL and never a local repository path.

Accepted file formats for the staged 3DS library are `.3ds` and `.cia`.
