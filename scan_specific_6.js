const https = require('https');

const list = [
  { seq: 1704, row: 1705, name: '(주)해시웰', bno: '8058801310', ceo: '김태성' },
  { seq: 1705, row: 1706, name: '인공지능과블록체인', bno: '8681201145', ceo: '김경렬' },
  { seq: 1706, row: 1707, name: '하이엘', bno: '6430603392', ceo: '곽도경' },
  { seq: 1707, row: 1708, name: '제이더블유시스템', bno: '7901301612', ceo: '양진웅' },
  { seq: 1708, row: 1709, name: '(주)피알소프트', bno: '6178617055', ceo: '이무식' },
  { seq: 1709, row: 1710, name: '(주)세원88', bno: '7828703449', ceo: '이경숙' }
];

function fetchBizno(bno) {
  return new Promise(resolve => {
    https.get('https://bizno.net/article/' + bno, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
  for (const item of list) {
    const html = await fetchBizno(item.bno);
    console.log(`=== ${item.seq} ${item.name} (${item.bno}) ===`);
    if (!html) {
      console.log('No response');
      continue;
    }
    
    // Status
    const statusMatch = html.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    const status = statusMatch ? statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'Unknown';
    
    // Phone
    const phoneMatch = html.match(/<th>\s*전화번호\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    const phone = phoneMatch ? phoneMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'None';

    // Address
    const addrMatch = html.match(/<th>\s*회사주소\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    const addr = addrMatch ? addrMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'None';

    // Tax Type
    const taxMatch = html.match(/<th>\s*과세유형\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    const tax = taxMatch ? taxMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'None';

    // Mail order
    const mailMatch = html.match(/<th>\s*통신판매업번호\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    const mail = mailMatch ? mailMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'None';

    console.log('Status:', status);
    console.log('Phone:', phone);
    console.log('Addr:', addr);
    console.log('Tax:', tax);
    console.log('MailOrder:', mail);
  }
}
run();
