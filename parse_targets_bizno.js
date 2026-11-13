const https = require('https');

const targets = [
  { no: 1128, name: '(주)엑스비트', ceo: '한나영', brno: '7838803473' },
  { no: 1129, name: '(주)트리플아이', ceo: '김상진', brno: '3428703071' },
  { no: 1130, name: '비비스로지틱스', ceo: '유성빈', brno: '8350203047' },
  { no: 1131, name: '터틀필름', ceo: '이여진', brno: '1725600700' },
  { no: 1132, name: '(주)마인드코어', ceo: '탁동영', brno: '2188703841' },
  { no: 1133, name: '솔민상사', ceo: '김은미', brno: '2431900875' }
];

function parseBiznoDetail(t) {
  return new Promise(resolve => {
    https.get(`https://bizno.net/article/${t.brno}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const getField = (f) => {
          const m = text.match(new RegExp(f + '\\s*([^ ]+)'));
          return m ? m[1] : '';
        };
        const statusMatch = text.match(/사업자 현재 상태\s*([^※<]+)/);
        const status = statusMatch ? statusMatch[1].replace(/&nbsp;/g, '').trim() : '';
        const phoneMatch = text.match(/전화번호\s*([0-9-]{9,14})/);
        const teleNoMatch = text.match(/통신판매업번호\s*([^ ]+)/);
        const addrMatch = text.match(/회사주소\s*([^관]+)/);
        const taxOfficeMatch = text.match(/관할세무서\s*([^ ]+)/);
        
        console.log(`=== [${t.no}] ${t.name} (${t.brno}) ===`);
        console.log('상태:', status);
        console.log('통신판매업번호:', teleNoMatch ? teleNoMatch[1] : '없음');
        console.log('회사주소:', addrMatch ? addrMatch[1].trim() : '없음');
        console.log('관할세무서:', taxOfficeMatch ? taxOfficeMatch[1] : '없음');
        console.log('전화번호 매칭:', phoneMatch ? phoneMatch[1] : '없음');
        resolve();
      });
    });
  });
}

async function run() {
  for (const t of targets) {
    await parseBiznoDetail(t);
  }
}
run();
