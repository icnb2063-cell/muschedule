const DATA_KEY = 'shows';

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function validateShows(value) {
  if (!Array.isArray(value)) return false;
  return value.every(item => {
    return item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.start === 'string' &&
      typeof item.end === 'string' &&
      (item.venue === undefined || item.venue === null || typeof item.venue === 'string') &&
      (item.runtime === undefined || item.runtime === null || typeof item.runtime === 'number') &&
      (item.color === undefined || item.color === null || typeof item.color === 'string') &&
      (item.watched === undefined || Array.isArray(item.watched));
  });
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return jsonResponse({ error: 'D1 binding DB가 연결되지 않았습니다.' }, 500);
    }

    const row = await env.DB
      .prepare('SELECT value FROM app_data WHERE key = ?')
      .bind(DATA_KEY)
      .first();

    const shows = row && row.value ? JSON.parse(row.value) : [];
    return jsonResponse({ shows });
  } catch (error) {
    return jsonResponse({ error: error.message || '데이터를 불러오지 못했습니다.' }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  try {
    if (!env.DB) {
      return jsonResponse({ error: 'D1 binding DB가 연결되지 않았습니다.' }, 500);
    }

    const body = await request.json();
    const shows = body.shows;

    if (!validateShows(shows)) {
      return jsonResponse({ error: '저장할 공연 데이터 형식이 올바르지 않습니다.' }, 400);
    }

    await env.DB
      .prepare(`
        INSERT INTO app_data (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = datetime('now')
      `)
      .bind(DATA_KEY, JSON.stringify(shows))
      .run();

    return jsonResponse({ ok: true, saved: shows.length });
  } catch (error) {
    return jsonResponse({ error: error.message || '데이터를 저장하지 못했습니다.' }, 500);
  }
}

export async function onRequestPost(context) {
  return onRequestPut(context);
}
