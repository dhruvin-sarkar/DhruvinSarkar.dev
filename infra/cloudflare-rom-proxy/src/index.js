/**
 * Cloudflare ROM Proxy Worker
 * 
 * IMPORTANT: This worker handles CORS for multiple origins and supports
 * HEAD and OPTIONS requests, which are required by the emulator's
 * range-based loading (XMLHttpRequest) on both local and production sites.
 */

const ALLOWED_ORIGINS = [
  "https://dhruvin-sarkar-dev.vercel.app",
  "https://dhruvin-sarkar.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const ALLOWED_METHODS = "GET, HEAD, OPTIONS";
const ALLOWED_HEADERS = "Range, If-Modified-Since, If-None-Match, Origin, X-Requested-With, Content-Type, Accept";

const buildCorsHeaders = (request) => {
  const headers = new Headers();
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  
  // Find match in either Origin (standard for XHR/Fetch) or Referer
  const match = ALLOWED_ORIGINS.find(o => origin === o || referer.startsWith(o));
  
  if (match) {
    headers.set("Access-Control-Allow-Origin", match);
  } else {
    // Fallback to first origin to satisfy browser CORS checks
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }
  
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
  headers.set("Vary", "Origin, Referer");
  return headers;
};

export default {
  async fetch(request, env) {
    // 1. Handle Preflight (mandatory for emulators using Range headers)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: buildCorsHeaders(request),
      });
    }

    // 2. Methods
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: buildCorsHeaders(request),
      });
    }

    // 3. Security Check
    const origin = request.headers.get("Origin") || "";
    const referer = request.headers.get("Referer") || "";
    const isAllowed = ALLOWED_ORIGINS.some(o => origin === o || referer.startsWith(o));

    if (!isAllowed) {
      return new Response("Forbidden: Origin not allowed", {
        status: 403,
        headers: buildCorsHeaders(request),
      });
    }

    // 4. Path Analysis
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!key) {
      return new Response("Not Found", {
        status: 404,
        headers: buildCorsHeaders(request),
      });
    }

    // 5. Bucket Access
    const object = await env.ROM_BUCKET.get(key, {
      range: request.headers,
    });

    if (!object) {
      return new Response("Not Found", {
        status: 404,
        headers: buildCorsHeaders(request),
      });
    }

    // 6. Response Construction
    const headers = buildCorsHeaders(request);
    object.writeHttpMetadata(headers);
    headers.set("Content-Type", headers.get("Content-Type") || "application/octet-stream");
    headers.set("Accept-Ranges", "bytes");

    if (object.httpEtag) {
      headers.set("ETag", object.httpEtag);
    }

    // Handle range headers
    const requestedRange = request.headers.get("Range");
    if (requestedRange && object.range && Number.isFinite(object.range.offset) && Number.isFinite(object.range.length)) {
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
  },
};
