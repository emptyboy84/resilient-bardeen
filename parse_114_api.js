const fs = require('fs');
const html = fs.readFileSync('114_nature.html', 'utf8');
const matches = html.match(/\/search\/[a-zA-Z0-9_\/]+/gi) || [];
console.log('Search APIs:', [...new Set(matches)]);
const jsScript = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
jsScript.forEach((s, i) => {
  if (s.includes('18257799') || s.includes('LOCALDATA') || s.includes('tel')) {
    console.log(`Script ${i}:`, s.substring(0, 300));
  }
});
