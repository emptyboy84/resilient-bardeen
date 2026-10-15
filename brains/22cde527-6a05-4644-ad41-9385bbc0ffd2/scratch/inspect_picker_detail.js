const https = require('https');

https.get('https://www.saramin.co.kr/zf_user/company-info/view?csn=N3FJclNyUlVnRTVjK1NNNlh3cHREQT09', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Look for all summary items
    const summaryRegex = /<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>[\s\S]*?<p class="company_summary_desc">\s*([^<]+)\s*<\/p>/g;
    let m;
    while ((m = summaryRegex.exec(d)) !== null) {
      console.log(`${m[2].trim()}: ${m[1].trim()}`);
    }

    // Look for any table or mention of 192 or 1,920
    const matches = d.match(/192[^<]*/g) || d.match(/1,920[^<]*/g);
    console.log('Matches for 192:', matches);

    // Look for details
    const clean = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const idx = clean.indexOf('매출액');
    if (idx !== -1) {
      console.log('Snippet around 매출액:', clean.substring(Math.max(0, idx - 50), idx + 200));
    }
  });
});
