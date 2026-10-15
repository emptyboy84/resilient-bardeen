const fs = require('fs');

const scratchDir = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\0206a2db-975c-4d12-aa6b-790955bb4219\\scratch';

console.log('--- query_8985800242.html ---');
const queryHtml = fs.readFileSync(scratchDir + '\\query_8985800242.html', 'utf8');
const queryLines = queryHtml.split('\n');
queryLines.forEach((l, i) => {
  if (l.includes('898-58-00242') || l.includes('8985800242') || l.includes('투투') || l.includes('서현석')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});

console.log('\n--- article_8985800242.html ---');
const articleHtml = fs.readFileSync(scratchDir + '\\article_8985800242.html', 'utf8');
const articleLines = articleHtml.split('\n');
articleLines.forEach((l, i) => {
  if (l.includes('종업원') || l.includes('상태') || l.includes('대표') || l.includes('업종') || l.includes('주소') || l.includes('table_guide01')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
