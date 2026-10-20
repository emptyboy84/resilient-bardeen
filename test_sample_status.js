const https = require('https');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('target_companies_status_check.json', 'utf8'));
const sample = data.userList.slice(0, 10);

function getStatus(bno) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + bno, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/사업자\s*현재\s*상태[^:]*:\s*([^<\r\n]+)/i);
        if (m) {
          const s = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          resolve(s);
        } else {
          resolve('미확인');
        }
      });
    }).on('error', e => resolve('에러:' + e.message));
  });
}

(async () => {
  console.log('--- Sample 10 Verification ---');
  for (const item of sample) {
    const s = await getStatus(item.bnoClean);
    console.log(`[${item.row}행] ${item.name} (${item.bno}) => ${s}`);
  }
})();
