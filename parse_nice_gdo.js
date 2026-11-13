const fs = require('fs');
const html = fs.readFileSync('nice_6308802466.html', 'utf8');

// nicebizinfo 테이블 파싱
const m = html.match(/<table[\s\S]*?<\/table>/gi) || [];
console.log('Tables in nice:', m.length);
m.forEach((t, i) => {
  if (t.includes('지디오') || t.includes('김태완') || t.includes('전화') || t.includes('630')) {
    console.log(`Table ${i}:`, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500));
  }
});
