Title: Live Content

Description: Fetched live

Source: https://www.onclev.com

---

<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Onclev</title>
  <style>
    html, body { width:100%; height:100%; margin:0; overflow:hidden; background:#171617; }
    #onclev-view { display:block; width:100%; height:100%; border:0; background:#171617; }
    #onclev-loading { position:fixed; inset:0; display:grid; place-items:center; z-index:1; color:#948c7e; background:#171617; font:11px/1.5 ui-monospace, monospace; letter-spacing:.12em; transition:opacity 160ms ease; pointer-events:none; }
    #onclev-loading[hidden] { display:none; }
  </style>
</head>
<body>
  <div id="onclev-loading">ONCLEV · LOADING</div>
  <iframe id="onclev-view" title="온클레브 홈페이지" allow="fullscreen"></iframe>
  <script>
    (() => {
      const BREAKPOINT = 768;
      const files = {
        desktop: 'onclev-homepage-standalone.html',
        mobile: 'onclev-homepage-mobile-standalone.html'
      };
      const frame = document.getElementById('onclev-view');
      const loading = document.getElementById('onclev-loading');
      const query = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
      let activeMode = '';

      function syncPageState(fromMode, toMode) {
        try {
          const fromKey = fromMode === 'mobile' ? 'onclev_page_v2m' : 'onclev_page_v2';
          const toKey = toMode === 'mobile' ? 'onclev_page_v2m' : 'onclev_page_v2';
          const page = localStorage.getItem(fromKey);
          if (page) localStorage.setItem(toKey, page);
        } catch (_) {}
      }

      function render() {
        const nextMode = query.matches ? 'mobile' : 'desktop';
        if (nextMode === activeMode) return;
        if (activeMode) syncPageState(activeMode, nextMode);
        activeMode = nextMode;
        loading.hidden = false;
        frame.src = files[nextMode];
        frame.dataset.mode = nextMode;
      }

      frame.addEventListener('load', () => { loading.hidden = true; });
      if (query.addEventListener) query.addEventListener('change', render);
      else query.addListener(render);
      render();
    })();
  </script>
</body>
</html>


