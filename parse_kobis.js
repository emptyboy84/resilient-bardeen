const fs = require('fs');
const html = fs.readFileSync('kobis_songarak.html', 'utf8');

const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) || [];
console.log('Tables:', tableMatches.length);
tableMatches.forEach((t, i) => {
  const text = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Table ${i}:`, text);
});

// 링크 추출
const links = html.match(/href="[^"]*searchCompanyDtl\.do[^"]*"/gi) || [];
console.log('Detail links:', links);
