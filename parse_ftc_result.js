const fs = require('fs');
const html = fs.readFileSync('ftc_result_bss.html', 'utf8');

const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) || [];
console.log('Tables found:', tableMatches.length);
tableMatches.forEach((t, i) => {
  if (t.includes('비에스에스') || t.includes('김재일') || t.includes('5295500699') || t.includes('부산진')) {
    console.log(`Table ${i}:`, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
});

// a 링크
const aMatches = html.match(/<a[^>]*href="[^"]*selectBizCommPop\.do[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
console.log('Pop links:', aMatches);
