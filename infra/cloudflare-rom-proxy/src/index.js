/**
 * Cloudflare ROM Proxy Worker
 * 
 * Bulletproof CORS & Range loading for EmulatorJS.
 */

const ALLOWED_ORIGINS = [
  "https://dhruvin-sarkar-dev.vercel.app",
  "https://dhruvin-sarkar.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const buildCorsHeaders = (request) => {
  const headers = new Headers();
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");
  
  // Decide which origin to allow. Mirror the request Origin if it's in our safe list.
  let allowedOrigin = ALLOWED_ORIGINS[0];
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    allowedOrigin = origin;
  } else if (referer) {
    try {
      const refUrl = new URL(referer);
      if (ALLOWED_ORIGINS.includes(refUrl.origin)) {
        allowedOrigin = refUrl.origin;
      }
    } catch (e) {}
  }

  // Mandatory CORS headers for EmulatorJS range loading (XMLHttpRequest + Fetch)
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Range, If-Modified-Since, If-None-Match, Origin, X-Requested-With, Content-Type, Accept, Referer");
  headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges, ETag");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin, Referer");
  return headers;
};

export default {
  async fetch(request, env) {
    try {
      const corsHeaders = buildCorsHeaders(request);

      // 1. Handle Preflight OPTIONS (Mandatory for range requests)
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // 2. Validate Methods
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: corsHeaders,
        });
      }

      // 3. Security Filter
      const origin = request.headers.get("Origin");
      const referer = request.headers.get("Referer");
      const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin) || (referer && ALLOWED_ORIGINS.some(o => referer.startsWith(o)));

      if (!isAllowed) {
        return new Response("Forbidden: Origin not allowed", {
          status: 403,
          headers: corsHeaders,
        });
      }

      // 4. Object Key Analysis
      const url = new URL(request.url);
      const key = url.pathname.replace(/^\/+/, "");

      if (!key) {
        return new Response("Not Found", {
          status: 404,
          headers: corsHeaders,
        });
      }

      // 5. R2 Bucket Fetch
      const object = await env.ROM_BUCKET.get(key, {
        range: request.headers,
      });

      if (!object) {
        return new Response("Not Found: " + key, {
          status: 404,
          headers: corsHeaders,
        });
      }

      // 6. Final Header Assembly
      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      
      // Force headers that EmulatorJS expects for binary streaming
      headers.set("Content-Type", headers.get("Content-Type") || "application/octet-stream");
      headers.set("Accept-Ranges", "bytes");

      if (object.httpEtag) {
        headers.set("ETag", object.httpEtag);
      }

      // 7. Manual Range Calculations (Cloudflare R2 range handling)
      const requestedRange = request.headers.get("Range");
      if (requestedRange && object.range && typeof object.range.offset === 'number' && typeof object.range.length === 'number') {
        const rangeStart = object.range.offset;
        const rangeEnd = rangeStart + object.range.length - 1;
        headers.set("Content-Range", `bytes ${rangeStart}-${rangeEnd}/${object.size}`);
        headers.set("Content-Length", String(object.range.length));
      } else {
        headers.set("Content-Length", String(object.size));
      }

      return new Response(request.method === "HEAD" ? null : object.body, {
        status: requestedRange ? 206 : 200,
        headers,
      });
    } catch (e) {
      return new Response("Worker Error: " + e.message, { status: 500 });
    }
  },
};
