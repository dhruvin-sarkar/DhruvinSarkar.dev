/**
 * Cloudflare ROM Proxy Worker
 * 
 * Optimized for EmulatorJS CORS & Range loading.
 */

const ALLOWED_ORIGINS = [
  "https://dhruvin-sarkar-dev.vercel.app",
  "https://dhruvin-sarkar.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const ALLOWED_METHODS = "GET, HEAD, OPTIONS";
const ALLOWED_HEADERS = "Range, If-Modified-Since, If-None-Match, Origin, X-Requested-With, Content-Type, Accept, Referer";

const buildCorsHeaders = (request) => {
  const headers = new Headers();
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer") || "";
  
  // Try to find a match in ALLOWED_ORIGINS
  let match = ALLOWED_ORIGINS.find(o => origin === o || referer.startsWith(o));
  
  if (match) {
    headers.set("Access-Control-Allow-Origin", match);
  } else if (origin) {
    // If there's an origin but no exact match, we still need to respond
    // Browsers often prefer the exact origin being echoed back if it's allowed
    // But for security we only echo if it matches our pattern.
    // For now, let's just use the first allowed one if stuck.
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  } else {
    headers.set("Access-Control-Allow-Origin", "*");
  }
  
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges, ETag");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin, Referer");
  return headers;
};

export default {
  async fetch(request, env) {
    try {
      const corsHeaders = buildCorsHeaders(request);

      // 1. Handle Preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // 2. Methods
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: corsHeaders,
        });
      }

      // 3. Security Check (Relaxed for debugging if needed, but keeping it for now)
      const origin = request.headers.get("Origin");
      const referer = request.headers.get("Referer") || "";
      const isAllowed = !origin || ALLOWED_ORIGINS.some(o => origin === o || referer.startsWith(o));

      if (!isAllowed) {
        return new Response("Forbidden: Origin not allowed", {
          status: 403,
          headers: corsHeaders,
        });
      }

      // 4. Path Analysis
      const url = new URL(request.url);
      const key = url.pathname.replace(/^\/+/, "");

      if (!key) {
        return new Response("Not Found", {
          status: 404,
          headers: corsHeaders,
        });
      }

      // 5. Bucket Access
      const object = await env.ROM_BUCKET.get(key, {
        range: request.headers,
      });

      if (!object) {
        return new Response("Not Found: " + key, {
          status: 404,
          headers: corsHeaders,
        });
      }

      // 6. Response Construction
      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      headers.set("Content-Type", headers.get("Content-Type") || "application/octet-stream");
      headers.set("Accept-Ranges", "bytes");

      if (object.httpEtag) {
        headers.set("ETag", object.httpEtag);
      }

      // Handle range headers
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
      return new Response("Internal Server Error: " + e.message, { status: 500 });
    }
  },
};
