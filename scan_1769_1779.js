const https = require('https');

const list = [
  { seq: 1769, row: 1770, name: '(주)필스그룹', bno: '5308601988', ceo: '박지환', addr: '부산 중구 중구로 67-8, 1층 (대청동4가)' },
  { seq: 1770, row: 1771, name: '테렌즈랩스', bno: '8542102147', ceo: '이지영', addr: '부산 해운대구 센텀1로 9, E동 505호(우동,롯데갤러리움센텀오피스텔)' },
  { seq: 1771, row: 1772, name: '오케이데이타시스템', bno: '6102041752', ceo: '김동훈', addr: '부산 강서구 명지오션시티2로 71, 107동 1203호(명지동,극동스타클래스아파트)' },
  { seq: 1772, row: 1773, name: '에스씨글로벌', bno: '4162451466', ceo: '이성철', addr: '부산 기장군 일광읍 일광로 98, 501호 (삼성리,선달빌딩)' },
  { seq: 1773, row: 1774, name: '도상(유책)', bno: '2538703688', ceo: '송재곤', addr: '부산 남구 용호로42번길 104-11, 1층 사무동 (용호동)' },
  { seq: 1774, row: 1775, name: '(주)와이케이솔루션', bno: '6608701398', ceo: '김영우', addr: '부산 강서구 명지오션시티12로 120, 609동 201호 (명지동,엘크루 블루오션)' },
  { seq: 1775, row: 1776, name: '웹그림', bno: '8221602544', ceo: '이유진', addr: '부산 연제구 연수로 179, 101동 2607호(연산동,아이유파크)' },
  { seq: 1776, row: 1777, name: '(유한)웨이진', bno: '1218644065', ceo: '김경진', addr: '부산 해운대구 선수촌로21번길 65, 302동 809호 (반여동,현대그린맨션)' },
  { seq: 1777, row: 1778, name: '이엠솔루션', bno: '3532701706', ceo: '장은혜', addr: '부산 동래구 충렬대로107번길 65, 301동 2202호(온천동,동래래미안아이파크)' },
  { seq: 1778, row: 1779, name: '옴니솔루션', bno: '8502801446', ceo: '오명환', addr: '부산 수영구 망미배산로10번길 108-3 (망미동)' },
  { seq: 1779, row: 1780, name: '(주)세아기술산업', bno: '8818703218', ceo: '최혜진', addr: '부산 강서구 명지국제2로 80, 2층 17호 (명지동,비주거시설동)' }
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
    const rawStatus = statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (rawStatus.includes('폐업')) status = '폐업';
    else if (rawStatus.includes('휴업')) status = '휴업';
    else if (rawStatus.includes('계속')) status = '정상 (계속사업자)';
    else status = rawStatus;
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
  for (const item of list) {
    const html = await fetchBizno(item.bno);
    const parsed = parseBizno(html);
    console.log(`Seq ${item.seq} (Row ${item.row}) ${item.name} (${item.bno}) -> Status: ${parsed.status} | Phone: ${parsed.phone || '공란(미공개)'} | 통신판매: ${parsed.mailOrder || '없음'}`);
  }
}
run();
