const fs = require('fs');
const html = fs.readFileSync('bizno_6052239511.html', 'utf8');

// 테이블의 th, td 쌍을 모두 추출해보자
const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
console.log('Total rows:', rows.length);
rows.forEach((r, i) => {
  const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean) console.log(`Row ${i}: ${clean}`);
});
