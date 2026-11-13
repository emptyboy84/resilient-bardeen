const https = require('https');

const targets = [
  { no: 1128, name: '(주)엑스비트', ceo: '한나영', brno: '7838803473' },
  { no: 1129, name: '(주)트리플아이', ceo: '김상진', brno: '3428703071' },
  { no: 1130, name: '비비스로지틱스', ceo: '유성빈', brno: '8350203047' },
  { no: 1131, name: '터틀필름', ceo: '이여진', brno: '1725600700' },
  { no: 1132, name: '(주)마인드코어', ceo: '탁동영', brno: '2188703841' },
  { no: 1133, name: '솔민상사', ceo: '김은미', brno: '2431900875' }
];

function checkBizno(t) {
  return new Promise(resolve => {
    https.get(`https://bizno.net/article/${t.brno}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const statusMatch = text.match(/사업자 현재 상태\s*:\s*([^ ]+)/) || text.match(/사업자 현재 상태\s*([^ ]+)/);
        const status = statusMatch ? statusMatch[1] : '확인불가';
        const phoneMatch = text.match(/전화번호\s*:\s*([^ ]+)/) || text.match(/전화번호\s*([0-9-]{9,14})/);
        const phone = phoneMatch ? phoneMatch[1] : '없음';
        const addrMatch = text.match(/회사주소\s*([^관]+)/);
        const addr = addrMatch ? addrMatch[1].trim() : '없음';
        console.log(`[${t.no} ${t.name}] 상태: ${status} | 전화: ${phone} | 주소: ${addr}`);
        resolve({ ...t, status, phone, addr, fullText: text });
      });
    }).on('error', e => {
      console.log(`[${t.no} ${t.name}] Error:`, e.message);
      resolve({ ...t, error: e.message });
    });
  });
}

async function run() {
  for (const t of targets) {
    await checkBizno(t);
  }
}
run();
