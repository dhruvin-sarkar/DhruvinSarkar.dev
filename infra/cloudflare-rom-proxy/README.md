# Cloudflare ROM Proxy

This Worker proxies PS1 and 3DS ROM requests from Cloudflare R2 and only serves
them when the request `Referer` starts with:

`https://dhruvin-sarkar-dev.vercel.app`

## Files

- `src/index.js`: Worker entrypoint
- `wrangler.toml`: Wrangler config with the `ROM_BUCKET` R2 binding

## Required Cloudflare setup

1. Create or choose your private R2 bucket that stores ROM objects.
2. Bind that bucket to this Worker as `ROM_BUCKET`.
3. Replace `bucket_name` in `wrangler.toml` with the real bucket name.
4. Deploy the Worker and note the resulting `*.workers.dev` URL.

## Expected object keys

The Worker uses the request pathname as the object key. Examples:

- `/3ds/pokemon-ultra-sun.3ds`
- `/ps1/tekken-3.chd`

That means a request to:

`https://your-worker.workers.dev/3ds/pokemon-ultra-sun.3ds`

will fetch the object key:

`3ds/pokemon-ultra-sun.3ds`

## Deploy

```bash
npx wrangler deploy
```

## Notes

- Direct bucket URLs are never exposed to the client.
- Requests without the allowed portfolio `Referer` return `403`.
- Missing objects return `404`.
- `GET`, `HEAD`, and `OPTIONS` are supported.
- `Range` headers are forwarded to R2 so large PS1 and 3DS assets can be streamed progressively.
- BIOS assets can live behind the same Worker, for example `bios/scph5501.bin`.
