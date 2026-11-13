const https = require('https');

const list = [
  { seq: 1781, row: 1782, name: '(주)투투정보시스템', bno: '8328600361', ceo: '박지형', addr: '부산 해운대구 센텀중앙로 90, 603호 (재송동,큐비이센텀)' },
  { seq: 1782, row: 1783, name: '(주)코리아아이티', bno: '5488603876', ceo: '김현철', addr: '부산 강서구 유통단지1로 41 (대저2동,108동111호)' },
  { seq: 1783, row: 1784, name: '우리메타커뮤니케이션', bno: '2475100746', ceo: '변보경', addr: '부산 금정구 금정로233번길 63, 101동 901호 (구서동,구서역두산위브포세이돈)' },
  { seq: 1784, row: 1785, name: '(주)퍼스널링크', bno: '4568103344', ceo: '김남훈', addr: '부산 해운대구 대천로67번길 12, 4층 401-제이100호 (좌동)' },
  { seq: 1785, row: 1786, name: '라인아웃(Lineout)', bno: '8870200658', ceo: '정인규', addr: '부산 부산진구 마철로 114, 103동 32층 3201호(당감동,서면비스타동원)' },
  { seq: 1786, row: 1787, name: '(주)이플러스', bno: '6068196206', ceo: '김상열', addr: '부산 부산진구 당감로17번길 89 (당감동)' },
  { seq: 1787, row: 1788, name: '(주)뉴페스타', bno: '5388104121', ceo: '정현지', addr: '부산 연제구 거제시장로 43, 402호 (거제동)' },
  { seq: 1788, row: 1789, name: '(주)인터라이프컴퍼니', bno: '1138672973', ceo: '문영효', addr: '부산 부산진구 가야공원로14번길 8, 1003호 (가야동,동아아파트)' },
  { seq: 1789, row: 1790, name: '(주)파인트리인터페이스', bno: '5498703390', ceo: '이병을', addr: '부산 해운대구 센텀서로 30, 2602, 2603호-58 (우동,케이엔엔타워)' },
  { seq: 1790, row: 1791, name: '야트디자인스튜디오', bno: '3444900893', ceo: '이영승', addr: '부산 연제구 거제천로 82, 102동 804호(연산동,시청역삼정그린코아포레스트)' },
  { seq: 1791, row: 1792, name: '컬러리즘', bno: '6020891851', ceo: '이성희', addr: '부산 중구 대교로 157, 103동 1514호(중앙동4가,서린엘마르센트로뷰)' },
  { seq: 1792, row: 1793, name: '브로디벨럽', bno: '8311600986', ceo: '황찬주', addr: '부산 남구 오륙도로 85, 112동 2801호 (용호동,오륙도SKVIEW아파트)' },
  { seq: 1793, row: 1794, name: '캐디언스시스템 김해지사', bno: '6051227170', ceo: '최동규', addr: '부산 북구 금곡대로285번길 46, 6층 601호(화명동,큐빅스타워)' }
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
    console.log(`Seq ${item.seq} (Row ${item.row}) ${item.name} (${item.bno}) -> Status: ${parsed.status} | Phone: ${parsed.phone || '공란'} | 통신: ${parsed.mailOrder || '없음'}`);
  }
}
run();
