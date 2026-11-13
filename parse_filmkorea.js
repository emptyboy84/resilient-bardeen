const fs = require('fs');
const html = fs.readFileSync('filmkorea_songarak.html', 'utf8');

// 테이블이나 dt, dd, 정보 블록 파싱
const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

console.log('Lines count:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('Songarak') || l.includes('Tel') || l.includes('Phone') || l.includes('Contact') || l.includes('Email') || l.includes('Address') || l.includes('이준상') || l.includes('Lee')) {
    console.log(lines.slice(Math.max(0, i-1), Math.min(lines.length, i+3)).join(' | '));
  }
});
