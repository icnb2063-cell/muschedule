const STATE_KEY = 'shows';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return json({ error: 'D1 binding DB가 없습니다.' }, 500);
  }

  const row = await env.DB
    .prepare('SELECT value FROM app_state WHERE key = ?')
    .bind(STATE_KEY)
    .first();

  if (!row || !row.value) {
    return json({ shows: [] });
  }

  try {
    return json({ shows: JSON.parse(row.value) });
  } catch (error) {
    return json({ shows: [] });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return json({ error: 'D1 binding DB가 없습니다.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: 'JSON 형식이 아닙니다.' }, 400);
  }

  const shows = Array.isArray(body.shows) ? body.shows : [];
  const value = JSON.stringify(shows);

  await env.DB
    .prepare(`
      INSERT INTO app_state (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = datetime('now')
    `)
    .bind(STATE_KEY, value)
    .run();

  return json({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
