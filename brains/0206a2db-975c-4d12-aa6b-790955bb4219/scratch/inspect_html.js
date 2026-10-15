const fs = require('fs');

for (const f of ['query_test.html', 'article_test.html']) {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<meta property="og:url" content="([^"]+)"/);
  console.log(f, m ? m[1] : 'no og:url');
  
  // also check if there are employee or count related terms
  const lines = content.split('\n');
  lines.forEach(l => {
    if (l.includes('종업원') || l.includes('사원') || l.includes('근로자') || l.includes('임직원') || l.includes('인원')) {
      console.log('  match:', l.trim());
    }
  });
}
