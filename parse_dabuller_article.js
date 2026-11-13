const fs = require('fs');
const d = fs.readFileSync('gukjenews_dabuller.html', 'utf8');
const idx = d.indexOf('article-view-content-div');
if (idx !== -1) {
  const content = d.substring(idx, idx + 2500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Content:\n', content);
}
