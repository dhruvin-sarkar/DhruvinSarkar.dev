const ALLOWED_ORIGIN = "https://dhruvin-sarkar-dev.vercel.app";
const ALLOWED_METHODS = "GET";
const ALLOWED_HEADERS = "Range, If-Modified-Since, If-None-Match";

const buildCorsHeaders = () => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Vary", "Referer");
  return headers;
};

export default {
  async fetch(request, env) {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: buildCorsHeaders(),
      });
    }

    const referer = request.headers.get("Referer") || "";

    if (!referer.startsWith(ALLOWED_ORIGIN)) {
      return new Response("Forbidden", {
        status: 403,
        headers: buildCorsHeaders(),
      });
    }

    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!key) {
      return new Response("Not Found", {
        status: 404,
        headers: buildCorsHeaders(),
      });
    }

    const object = await env.ROM_BUCKET.get(key, {
      range: request.headers,
    });

    if (!object) {
      return new Response("Not Found", {
        status: 404,
        headers: buildCorsHeaders(),
      });
    }

    const headers = buildCorsHeaders();
    object.writeHttpMetadata(headers);
    headers.set("Content-Type", headers.get("Content-Type") || "application/octet-stream");
    headers.set("Accept-Ranges", "bytes");

    if (object.httpEtag) {
      headers.set("ETag", object.httpEtag);
    }

    const requestedRange = request.headers.get("Range");
    if (requestedRange && object.range && Number.isFinite(object.range.offset) && Number.isFinite(object.range.length)) {
      const rangeStart = object.range.offset;
      const rangeEnd = rangeStart + object.range.length - 1;
      headers.set("Content-Range", `bytes ${rangeStart}-${rangeEnd}/${object.size}`);
      headers.set("Content-Length", String(object.range.length));
    } else {
      headers.set("Content-Length", String(object.size));
    }

    return new Response(object.body, {
      status: requestedRange ? 206 : 200,
      headers,
    });
  },
};
