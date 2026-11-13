const fs = require('fs');
const html = fs.readFileSync('saramin_binarity.html', 'utf8');

const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

lines.forEach((l, i) => {
  if (l.includes('바이너리티') || l.includes('노상호') || l.includes('주소') || l.includes('대표자') || l.includes('홈페이지')) {
    console.log(lines.slice(Math.max(0, i-1), Math.min(lines.length, i+4)).join(' | '));
  }
});
