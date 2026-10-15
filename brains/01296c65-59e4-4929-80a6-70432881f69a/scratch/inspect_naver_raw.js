const fs = require('fs');

const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/01296c65-59e4-4929-80a6-70432881f69a/scratch/naver_res.html', 'utf-8');

// search for URLs, titles, and text snippets inside the html
const textMatches = html.match(/"title":"[^"]*스튜디오비오[^"]*"/g);
console.log('Title matches:', textMatches);

const snippetMatches = html.match(/"content":"[^"]*스튜디오비오[^"]*"/g);
console.log('Content matches:', snippetMatches);

const allMatches = [];
let idx = 0;
while ((idx = html.indexOf('스튜디오비오', idx)) !== -1) {
  allMatches.push(html.substring(Math.max(0, idx - 80), Math.min(html.length, idx + 120)));
  idx += '스튜디오비오'.length;
}

console.log(`Found ${allMatches.length} raw occurrences. Samples:`);
allMatches.slice(0, 10).forEach((m, i) => console.log(`[${i}]`, m.replace(/\s+/g, ' ')));
