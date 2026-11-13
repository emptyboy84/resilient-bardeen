const https = require('https');
const fs = require('fs');

const targets = [
  { seq: 1034, name: '(주)젊은이컴퍼니', bno: '8118703091', rep: '서지수' },
  { seq: 1035, name: '(주)랑구스토리', bno: '3698703547', rep: '권오광' },
  { seq: 1036, name: '(주)선중에셋', bno: '7108102462', rep: '이봉식' }
];

function fetchBizno(item) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + item.bno, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        fs.writeFileSync(`bizno_${item.bno}.html`, d);
        const m = d.match(/사업자\s*현재\s*상태[^:]*:\s*([^<\r\n]+)/i);
        const status = m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '미확인';
        
        // 전화번호 확인
        const pMatch = d.match(/전화번호[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        let phone = pMatch ? pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        // 주소 확인
        const aMatch = d.match(/회사주소[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        let addr = aMatch ? aMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        resolve({ seq: item.seq, name: item.name, bno: item.bno, status, phone, addr });
      });
    }).on('error', e => resolve({ seq: item.seq, name: item.name, error: e.message }));
  });
}

(async () => {
  for (const t of targets) {
    const res = await fetchBizno(t);
    console.log(JSON.stringify(res, null, 2));
  }
})();
