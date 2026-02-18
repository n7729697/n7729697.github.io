const COOKIE_NAME = "vcid";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;

function toInt(value) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? 0 : n;
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  const result = {};
  const entries = cookieHeader.split(";");
  for (const entry of entries) {
    const part = entry.trim();
    if (!part) continue;
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const raw = part.slice(idx + 1).trim();
    try {
      result[key] = decodeURIComponent(raw);
    } catch {
      result[key] = raw;
    }
  }
  return result;
}

function normalizePath(path) {
  let p = typeof path === "string" ? path : "/";
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 200) p = p.slice(0, 200);
  return p.replace(/\/{2,}/g, "/");
}

function noStoreHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    ...extra
  };
}

async function readCounter(env, key) {
  const value = await env.COUNTER_KV.get(key);
  return toInt(value);
}

async function incrementCounter(env, key) {
  const current = await readCounter(env, key);
  const next = current + 1;
  await env.COUNTER_KV.put(key, String(next));
  return next;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.COUNTER_KV) {
    return new Response(
      JSON.stringify({ error: "Missing COUNTER_KV binding" }),
      { status: 500, headers: noStoreHeaders() }
    );
  }

  const url = new URL(request.url);
  const path = normalizePath(url.searchParams.get("path") || "/");

  const cookies = parseCookies(request.headers.get("Cookie"));
  let visitorId = cookies[COOKIE_NAME];
  const hasVisitorCookie = Boolean(visitorId);
  if (!visitorId) visitorId = crypto.randomUUID();

  const seenKey = `seen_uv:${visitorId}`;
  const pagePvKey = `page_pv:${path}`;

  const [sitePv, pagePv, seenFlag] = await Promise.all([
    incrementCounter(env, "site_pv"),
    incrementCounter(env, pagePvKey),
    env.COUNTER_KV.get(seenKey)
  ]);

  let siteUv;
  if (seenFlag) {
    siteUv = await readCounter(env, "site_uv");
  } else {
    siteUv = await incrementCounter(env, "site_uv");
    await env.COUNTER_KV.put(seenKey, "1", { expirationTtl: VISITOR_COOKIE_MAX_AGE });
  }

  const headers = noStoreHeaders();
  if (!hasVisitorCookie) {
    headers["Set-Cookie"] =
      `${COOKIE_NAME}=${encodeURIComponent(visitorId)}; Max-Age=${VISITOR_COOKIE_MAX_AGE}; Path=/; Secure; HttpOnly; SameSite=Lax`;
  }

  return new Response(
    JSON.stringify({
      site_uv: siteUv,
      site_pv: sitePv,
      page_pv: pagePv,
      path
    }),
    { status: 200, headers }
  );
}
