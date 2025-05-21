export default {
  async fetch(request) {
    const url = new URL(request.url);
    const utm = url.searchParams.get('utm_source');

    const cacheKeyUrl = new URL(url);
    if (utm === 'tdi-ga-pis-dsp-seg') {
      cacheKeyUrl.searchParams.set('__cfseg', '1');
    }

    const cacheKey = new Request(cacheKeyUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);
    if (!response) {
      response = await fetch(request);
      response = new Response(response.body, response);
      response.headers.set("CF-Cache-Variant", utm || "none");
      await cache.put(cacheKey, response.clone());
    }

    return response;
  }
}
