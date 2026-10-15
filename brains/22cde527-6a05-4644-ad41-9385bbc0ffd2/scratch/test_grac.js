const https = require('https');

function testGrac(name) {
  return new Promise(resolve => {
    // GRAC game rating search
    const url = 'https://www.grac.or.kr/Board/GameSearch.aspx?searchtext=' + encodeURIComponent(name);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[GRAC] "${name}" Status: ${res.statusCode}, Length: ${d.length}`);
        const rows = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        console.log(`[GRAC] Rows count: ${rows.length}`);
        rows.slice(0, 3).forEach(r => console.log('   Row:', r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')));
        resolve();
      });
    }).on('error', () => resolve());
  });
}

testGrac('시드게임즈');
