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

  function formatNumber(value) {
    return value.toLocaleString();
  }

  function fetchCounter(path) {
    return new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () {
        reject(new Error("timeout"));
      }, 4000);

      fetch("/api/counter?path=" + encodeURIComponent(path), {
        method: "GET",
        cache: "no-store",
        credentials: "include"
      })
        .then(function (res) {
          if (!res.ok) throw new Error("http_" + res.status);
          return res.json();
        })
        .then(function (data) {
          clearTimeout(timeout);
          resolve(data);
        })
        .catch(function (err) {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  var namespace = (root.getAttribute("data-namespace") || "site").trim().toLowerCase();
  var baseline = {
    siteUv: toInt(root.getAttribute("data-base-site-uv")),
    sitePv: toInt(root.getAttribute("data-base-site-pv"))
  };
  var cacheKey = "visitor-counter-cache-v3:" + namespace;
  var cache = safeParseJSON(safeGetStorage(cacheKey), {});
  var state = {
    siteUv: toInt(cache.siteUv),
    sitePv: toInt(cache.sitePv)
  };

  var siteUvEl = root.querySelector('[data-counter-value="site_uv"]');
  var sitePvEl = root.querySelector('[data-counter-value="site_pv"]');

  function render() {
    if (siteUvEl) siteUvEl.textContent = formatNumber(baseline.siteUv + state.siteUv);
    if (sitePvEl) sitePvEl.textContent = formatNumber(baseline.sitePv + state.sitePv);
  }

  function persist() {
    safeSetStorage(
      cacheKey,
      JSON.stringify({
        siteUv: state.siteUv,
        sitePv: state.sitePv,
        updatedAt: Date.now()
      })
    );
  }

  render();

  fetchCounter(window.location.pathname)
    .then(function (data) {
      state.siteUv = Math.max(state.siteUv, toInt(data.site_uv));
      state.sitePv = Math.max(state.sitePv, toInt(data.site_pv));
      persist();
      render();
    })
    .catch(function () {
      return;
    });
})();
