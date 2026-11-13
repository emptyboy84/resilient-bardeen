const https = require('https');
const fs = require('fs');

const bnos = [
  { seq: 673, name: '성림기획', bno: '4232500598' },
  { seq: 953, name: '크리에이톤', bno: '5013544027' },
  { seq: 950, name: '크레아티보', bno: '5158801381' },
  { seq: 962, name: '테크핀코리아', bno: '3518102337' },
  { seq: 981, name: '퍼니처닷컴', bno: '6358702542' },
  { seq: 1002, name: '플로워크연구소', bno: '6308702004' }
];

function fetchMkbz(bno) {
  return new Promise(resolve => {
    https.get('https://marketbz.com/companyDetail/' + bno, {
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
  for (const b of bnos) {
    const html = await fetchMkbz(b.bno);
    console.log(`=== ${b.seq} ${b.name} (${b.bno}) ===`);
    // extract text from html
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = html.match(/0\d{1,2}-\d{3,4}-\d{4}/g) || [];
    console.log('Phones:', Array.from(new Set(phones)));
    const addrMatch = text.match(/소재지\s*:\s*([^;]+)/) || text.match(/주소\s*:\s*([^;]+)/);
    if (addrMatch) console.log('Addr snippet:', addrMatch[0].substring(0, 100));
    // check snippet around company name
    const idx = text.indexOf(b.name);
    if (idx !== -1) {
      console.log('Snippet:', text.substring(idx, idx + 400));
    }
  }
}

run();
