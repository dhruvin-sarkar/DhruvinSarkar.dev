export default {
  async fetch(request, env) {
    const allowedOrigin = 'https://dhruvin-sarkar-dev.vercel.app';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Expose-Headers': 
            'Content-Length, Content-Range, Accept-Ranges, ETag',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));

    const object = await env.ROM_BUCKET.get(key);

    if (!object) {
      return new Response(`Not Found: ${key}`, { status: 404 });
    }

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 
        'Content-Length, Content-Range, Accept-Ranges, ETag',
      'Content-Length': object.size,
    };

    if (request.method === 'HEAD') {
      return new Response(null, { status: 200, headers });
    }

    return new Response(object.body, { status: 200, headers });
  }
};
