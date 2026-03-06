# PlayStation 1 ROM Manifest

PlayStation 1 ROM binaries do not belong in this repository.

This folder should only contain lightweight metadata such as:

- `manifest.json`
- optional cover art assets

Actual PS1 game files must be stored in the private Cloudflare R2 bucket and
served through the ROM proxy Worker.

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
