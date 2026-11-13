const https = require('https');
const fs = require('fs');

const targets = [
  { seq: 1046, name: '아이네트', bno: '3093020763', rep: '장재희' },
  { seq: 1047, name: '비에스에스', bno: '5295500699', rep: '김재일' },
  { seq: 1048, name: '디올림엑스(주)', bno: '7648703422', rep: '이진영' },
  { seq: 1049, name: '(주)바이너리티', bno: '4618602513', rep: '노상호' },
  { seq: 1050, name: '다불러', bno: '2162600721', rep: '도현진' }
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
