const ALLOWED_ORIGIN = "https://dhruvin-sarkar-dev.vercel.app";

export default {
  async fetch(request, env) {
    const referer = request.headers.get("Referer") || "";

    if (!referer.startsWith(ALLOWED_ORIGIN)) {
      return new Response("Forbidden", { status: 403 });
    }

    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!key) {
      return new Response("Not Found", { status: 404 });
    }

    const object = await env.ROM_BUCKET.get(key);

    if (!object) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    headers.set("Vary", "Referer");
    headers.set("Content-Type", headers.get("Content-Type") || "application/octet-stream");

    if (object.etag) {
      headers.set("ETag", object.etag);
    }

    return new Response(object.body, {
      status: 200,
      headers,
    });
  },
};
