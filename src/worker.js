export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/shows') {
      return handleShows(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function handleShows(request, env) {
  if (!env.DB) {
    return json({ error: 'D1 바인딩 DB가 연결되지 않았습니다.' }, 500);
  }

  if (request.method === 'GET') {
    const row = await env.DB
      .prepare('SELECT value FROM app_data WHERE key = ?')
      .bind('shows')
      .first();

    if (!row || !row.value) return json({ shows: [] });

    try {
      const shows = JSON.parse(row.value);
      return json({ shows: Array.isArray(shows) ? shows : [] });
    } catch (e) {
      return json({ shows: [] });
    }
  }

  if (request.method === 'PUT') {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: 'JSON 형식이 올바르지 않습니다.' }, 400);
    }

    const shows = Array.isArray(body.shows) ? body.shows : [];
    const value = JSON.stringify(shows);

    await env.DB
      .prepare(`
        INSERT INTO app_data (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = datetime('now')
      `)
      .bind('shows', value)
      .run();

    return json({ ok: true, count: shows.length });
  }

  return json({ error: '허용되지 않는 요청 방식입니다.' }, 405);
}
