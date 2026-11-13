const fs = require('fs');
const html = fs.readFileSync('bizno_1398603518.html', 'utf8');

const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) || [];
tableMatches.forEach((t, i) => {
  const text = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Table ${i}:`, text);
});
