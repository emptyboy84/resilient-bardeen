const fs = require('fs');
const html = fs.readFileSync('saramin_seonjung.html', 'utf8');

const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

lines.forEach((l, i) => {
  if (l.includes('선중에셋') || l.includes('이봉식') || l.includes('좌동순환로') || l.includes('대표자') || l.includes('설립')) {
    console.log(lines.slice(Math.max(0, i-2), Math.min(lines.length, i+4)).join(' | '));
  }
});
