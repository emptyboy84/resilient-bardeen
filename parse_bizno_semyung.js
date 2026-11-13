const fs = require('fs');
const html = fs.readFileSync('bizno_6728603048.html', 'utf8');

const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) || [];
console.log('Tables found:', tableMatches.length);
tableMatches.forEach((t, i) => {
  const text = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Table ${i}:`, text);
});
