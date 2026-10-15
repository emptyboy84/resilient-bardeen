async function checkNuxt() {
  const res = await fetch('https://www.nicebizinfo.com/_nuxt/B3i_zuRu.js', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const js = await res.text();
  console.log('Nuxt entry len:', js.length);
  // find other chunk files
  const chunks = js.match(/\/?[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.js/g) || js.match(/["']([a-zA-Z0-9_\-]+\.js)["']/g);
  console.log('Chunks:', chunks ? chunks.slice(0, 20) : null);
}

checkNuxt();
