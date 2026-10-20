const fs = require('fs');

const html = fs.readFileSync('naver_res.html', 'utf8');

// find place data JSON in naver_res.html
const idx = html.indexOf('에이치에스렌텍');
if (idx !== -1) {
  console.log('Snippet around 에이치에스렌텍:');
  console.log(html.slice(Math.max(0, idx - 200), idx + 1000));
}

// look for place id
const m = html.match(/\"id\":\"([0-9]+)\"/g) || html.match(/place\/([0-9]+)/g);
console.log('Place ID matches:', m);
