(function () {
  "use strict";

  var root = document.querySelector("[data-visitor-counter]");
  if (!root) return;

  function toInt(value) {
    var n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      return;
    }
  }

  function safeParseJSON(text, fallback) {
    if (!text) return fallback;
    try {
      return JSON.parse(text);
    } catch (err) {
      return fallback;
    }
  }

  function normalizePath(pathname) {
    var path = pathname || "/";
    var normalized = path.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    return normalized || "home";
  }

  var namespace = (root.getAttribute("data-namespace") || window.location.hostname || "site")
    .trim()
    .toLowerCase();
  var pageName = normalizePath(window.location.pathname);
  var pageCounterKey = "page_pv_" + pageName;
  var baseline = {
    siteUv: toInt(root.getAttribute("data-base-site-uv")),
    sitePv: toInt(root.getAttribute("data-base-site-pv")),
    pagePv: toInt(root.getAttribute("data-base-page-pv"))
  };

  var cacheKey = "visitor-counter-cache-v1:" + namespace;
  var uvSeenKey = "visitor-counter-uv-seen-v1:" + namespace;
  var cache = safeParseJSON(safeGetStorage(cacheKey), {});
  var state = {
    siteUv: toInt(cache.siteUv),
    sitePv: toInt(cache.sitePv),
    pagePv: toInt(cache.pagePvByPath && cache.pagePvByPath[pageName])
  };

  var siteUvEl = root.querySelector('[data-counter-value="site_uv"]');
  var sitePvEl = root.querySelector('[data-counter-value="site_pv"]');
  var pagePvEl = root.querySelector('[data-counter-value="page_pv"]');

  function formatNumber(value) {
    return value.toLocaleString();
  }

  function render() {
    if (siteUvEl) siteUvEl.textContent = formatNumber(baseline.siteUv + state.siteUv);
    if (sitePvEl) sitePvEl.textContent = formatNumber(baseline.sitePv + state.sitePv);
    if (pagePvEl) pagePvEl.textContent = formatNumber(baseline.pagePv + state.pagePv);
  }

  function persistCache() {
    if (!cache.pagePvByPath) cache.pagePvByPath = {};
    cache.siteUv = state.siteUv;
    cache.sitePv = state.sitePv;
    cache.pagePvByPath[pageName] = state.pagePv;
    cache.updatedAt = Date.now();
    safeSetStorage(cacheKey, JSON.stringify(cache));
  }

  function fetchJSON(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var timeoutHandle = setTimeout(function () {
        reject(new Error("timeout"));
      }, timeoutMs || 3000);

      fetch(url, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("http_" + res.status);
          return res.json();
        })
        .then(function (data) {
          clearTimeout(timeoutHandle);
          resolve(data);
        })
        .catch(function (err) {
          clearTimeout(timeoutHandle);
          reject(err);
        });
    });
  }

  function counterPath(action, key, amount) {
    var ns = encodeURIComponent(namespace);
    var counterKey = encodeURIComponent(key);
    if (action === "hit") {
      return "https://api.countapi.xyz/hit/" + ns + "/" + counterKey + "?amount=" + toInt(amount || 1);
    }
    return "https://api.countapi.xyz/get/" + ns + "/" + counterKey;
  }

  function getValue(key) {
    return fetchJSON(counterPath("get", key), 2600).then(function (data) {
      return toInt(data && data.value);
    });
  }

  function hitValue(key, amount) {
    return fetchJSON(counterPath("hit", key, amount), 2600).then(function (data) {
      return toInt(data && data.value);
    });
  }

  function updateSiteUv() {
    var seen = safeGetStorage(uvSeenKey) === "1";
    var op = seen ? getValue("site_uv") : hitValue("site_uv", 1).then(function (value) {
      safeSetStorage(uvSeenKey, "1");
      return value;
    });

    op.then(function (value) {
      state.siteUv = value;
      persistCache();
      render();
    }).catch(function () {
      return;
    });
  }

  function updateSitePv() {
    hitValue("site_pv", 1)
      .then(function (value) {
        state.sitePv = value;
        persistCache();
        render();
      })
      .catch(function () {
        return;
      });
  }

  function updatePagePv() {
    hitValue(pageCounterKey, 1)
      .then(function (value) {
        state.pagePv = value;
        persistCache();
        render();
      })
      .catch(function () {
        return;
      });
  }

  render();
  updateSiteUv();
  updateSitePv();
  updatePagePv();
})();
