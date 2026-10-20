async function checkNuxt() {
  const res = await fetch('https://www.nicebizinfo.com/_nuxt/D_3M8xFo.js', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  console.log('Nuxt bundle size:', text.length);
  const apiMatches = text.match(/\/api\/[a-zA-Z0-9_\-\/]+/g);
  console.log('API matches:', [...new Set(apiMatches)]);
}
checkNuxt();
