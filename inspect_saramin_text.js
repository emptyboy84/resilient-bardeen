const fs = require('fs');
const html = fs.readFileSync('saramin_gdo.html', 'utf8');

// 모든 텍스트 라인 중 유의미한 것
const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

const targetIdx = [];
lines.forEach((l, i) => {
  if (l.includes('지디오') || l.includes('김태완') || l.includes('명륜로') || l.includes('대표자') || l.includes('홈페이지')) {
    targetIdx.push(i);
  }
});

console.log('Found occurrences:', targetIdx.length);
targetIdx.forEach(idx => {
  const start = Math.max(0, idx - 3);
  const end = Math.min(lines.length, idx + 5);
  console.log('--- Context ---');
  console.log(lines.slice(start, end).join(' | '));
});
