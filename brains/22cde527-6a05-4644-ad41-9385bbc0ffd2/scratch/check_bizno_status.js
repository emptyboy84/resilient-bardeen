const https = require('https');

https.get('https://bizno.net/article/6031085753', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Bizno status:', res.statusCode, 'len:', d.length);
    if (d.includes('접속대기')) {
      console.log('Bizno: Still in queue (접속대기)');
    } else {
      console.log('Bizno: Accessible! Title:', (d.match(/<title>([^<]+)<\/title>/) || [])[1]);
      const revMatch = d.match(/매출액[\s\S]{0,100}/);
      if (revMatch) console.log('Revenue snippet:', revMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  });
}).on('error', e => console.log('Bizno err:', e.message));
