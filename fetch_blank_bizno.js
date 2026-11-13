const https = require('https');
const fs = require('fs');

const targets = [
  { seq: 673, name: '성림기획', bno: '4232500598', ceo: '백효권' },
  { seq: 953, name: '크리에이톤', bno: '5013544027', ceo: '박수림' },
  { seq: 950, name: '크레아티보', bno: '5158801381', ceo: '백정인' },
  { seq: 962, name: '테크핀코리아', bno: '3518102337', ceo: '박종현' },
  { seq: 981, name: '퍼니처닷컴', bno: '6358702542', ceo: '김수지' },
  { seq: 1002, name: '플로워크연구소', bno: '6308702004', ceo: '김현준' }
];

function fetch(bno) {
  return new Promise(resolve => {
    https.get('https://bizno.net/article/' + bno, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const results = [];
  for (const t of targets) {
    const html = await fetch(t.bno);
    const getVal = (label) => {
      const m = html.match(new RegExp('<th>\\s*' + label + '\\s*<\\/th>\\s*<td>([\\s\\S]*?)<\\/td>', 'i'));
      return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim() : '';
    };

    results.push({
      seq: t.seq,
      name: t.name,
      bno: t.bno,
      ceo: t.ceo,
      status: getVal('사업자 현재 상태'),
      addr: getVal('등록주소지'),
      phone: getVal('전화번호'),
      fax: getVal('팩스번호'),
      email: getVal('회사이메일'),
      page: getVal('홈페이지'),
      bizType: getVal('업태'),
      bizItem: getVal('종목'),
      corpNo: getVal('법인등록번호'),
      taxOffice: getVal('관할세무서')
    });
    await new Promise(r => setTimeout(r, 300));
  }
  fs.writeFileSync('bizno_blank_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved bizno_blank_results.json');
}

run();
