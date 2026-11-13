const https = require('https');
const fs = require('fs');

const targets = [
  { seq: 1079, name: '(주)블록인바다', bno: '2878802700', rep: '안철우' },
  { seq: 1080, name: '(주)누리브릿지', bno: '4028703562', rep: '변찬우' },
  { seq: 1081, name: '(주)디퍼즈', bno: '1068802264', rep: '오현수' },
  { seq: 1082, name: '다원컴퍼니', bno: '3126800543', rep: '김정원' },
  { seq: 1083, name: '(주)초이스', bno: '1448138673', rep: '최기현' }
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
        
        const pMatch = d.match(/전화번호[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        let phone = pMatch ? pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        const aMatch = d.match(/회사주소[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        let addr = aMatch ? aMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        const fMatch = d.match(/팩스번호[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        let fax = fMatch ? fMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        resolve({ seq: item.seq, name: item.name, bno: item.bno, status, phone, fax, addr });
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
