const fs = require('fs');

console.log('--- SARAMIN SMILEBEE ---');
if (fs.existsSync('saramin_smilebee.html')) {
  const s = fs.readFileSync('saramin_smilebee.html', 'utf8');
  const phones = s.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|02[- ]?\d{3,4}[- ]?\d{4}/g) || [];
  console.log('Saramin phones:', [...new Set(phones)]);
  // let's extract company info block
  const lines = s.replace(/<[^>]+>/g, '\n').split('\n').map(l=>l.trim()).filter(Boolean);
  lines.forEach((l, i) => {
    if (l.includes('스마일비') || l.includes('강익수') || l.includes('대표자') || l.includes('전화') || l.includes('주소')) {
      console.log(`L${i}:`, lines.slice(Math.max(0, i-2), i+3).join(' | '));
    }
  });
}

console.log('--- NICE SMILEBEE ---');
if (fs.existsSync('nice_smilebee.html')) {
  const n = fs.readFileSync('nice_smilebee.html', 'utf8');
  const phones = n.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|02[- ]?\d{3,4}[- ]?\d{4}/g) || [];
  console.log('Nice phones:', [...new Set(phones)]);
  const tables = n.match(/<table[\s\S]*?<\/table>/gi) || [];
  tables.forEach((t, i) => {
    console.log(`Table ${i}:`, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  });
}
