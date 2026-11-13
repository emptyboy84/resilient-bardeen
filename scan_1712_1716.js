const https = require('https');
const ExcelJS = require('exceljs');

const list = [
  { seq: 1712, row: 1713, name: '에스제이미디어', bno: '6334800272', ceo: '최정은' },
  { seq: 1713, row: 1714, name: '구산기업', bno: '8173800089', ceo: '오영기' },
  { seq: 1714, row: 1715, name: '대림넷', bno: '6211587400', ceo: '황승민' },
  { seq: 1715, row: 1716, name: '(주)플랜씨', bno: '1728104241', ceo: '박정윤' },
  { seq: 1716, row: 1717, name: '(주)비즈트랙', bno: '8458600222', ceo: '김희영' }
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

function parseBizno(html) {
  let status = 'Unknown';
  const statusMatch = html.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  if (statusMatch) {
    status = statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  let phone = null;
  const phoneMatch = html.match(/<th>\s*전화번호\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  if (phoneMatch) {
    let raw = phoneMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw && raw !== '-' && !raw.includes('없음') && !raw.includes('비공개')) {
      const digits = raw.replace(/[^0-9]/g, '');
      if (digits.length === 10 && digits.startsWith('10')) {
        phone = '0' + digits.slice(0, 2) + '-' + digits.slice(2, 6) + '-' + digits.slice(6);
      } else if (digits.length === 11 && digits.startsWith('010')) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
      } else if (digits.length === 10 && (digits.startsWith('011') || digits.startsWith('016') || digits.startsWith('017') || digits.startsWith('018') || digits.startsWith('019'))) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length === 9 && digits.startsWith('02')) {
        phone = '02-' + digits.slice(2, 5) + '-' + digits.slice(5);
      } else if (digits.length === 10 && digits.startsWith('02')) {
        phone = '02-' + digits.slice(2, 6) + '-' + digits.slice(6);
      } else if (digits.length === 10 && (digits.startsWith('051') || digits.startsWith('070') || digits.startsWith('031') || digits.startsWith('052') || digits.startsWith('055'))) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length === 11 && digits.startsWith('070')) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
      } else if (raw.includes('-') && /\d{2,4}-\d{3,4}-\d{4}/.test(raw)) {
        phone = raw;
      }
    }
  }

  const mailMatch = html.match(/<th>\s*통신판매업번호\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  const mailOrder = mailMatch ? mailMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : null;

  return { status, phone, mailOrder };
}

async function run() {
  const file = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];

  for (const item of list) {
    const row = ws.getRow(item.row);
    console.log(`\n=== Seq ${item.seq} (Row ${item.row}) ${item.name} (${item.bno}) ===`);
    console.log(`Excel current: Status=${row.getCell(4).value}, Phone=${row.getCell(10).value}`);

    const html = await fetchBizno(item.bno);
    const parsed = parseBizno(html);
    console.log(`Bizno parsed: Status=${parsed.status}, Phone=${parsed.phone}, MailOrder=${parsed.mailOrder}`);
  }
}
run();
