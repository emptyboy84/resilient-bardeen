const https = require('https');

const list = [
  { seq: 1826, row: 1827, name: '(주)이에스아웃', bno: '4238600449', ceo: '제승봉', addr: '부산 해운대구 해운대로781번길 16, 1115호 (좌동, 신화하니엘타워)' },
  { seq: 1827, row: 1828, name: '(주)스티브', bno: '6098613228', ceo: '박삼서', addr: '부산 남구 수영로 261, 111동 604호 (대연동,대연에스케이뷰힐스)' },
  { seq: 1828, row: 1829, name: '(주)매직오브', bno: '6158703945', ceo: '이정삼', addr: '부산 해운대구 센텀중앙로 60, 805호 (우동,퍼스트인센텀)' },
  { seq: 1829, row: 1830, name: '오터', bno: '6153800601', ceo: '김형준', addr: '부산 북구 금곡대로 10 (덕천동)' },
  { seq: 1830, row: 1831, name: '유니크웹', bno: '4142102366', ceo: '박소영', addr: '부산 남구 용호로269번길 90, 411호 (용호동,벽산화이트타워)' },
  { seq: 1831, row: 1832, name: '한국아이티테크', bno: '3062451285', ceo: '길정미', addr: '부산 동래구 충렬대로 84, 9층(온천동,영남빌딩)' },
  { seq: 1832, row: 1833, name: '굿웹플', bno: '3941400580', ceo: '손정호', addr: '부산 해운대구 해운대로 790, 21층 2131호 (좌동,대림아크로텔)' },
  { seq: 1833, row: 1834, name: '(주)소프트케익', bno: '3848600144', ceo: '심인규', addr: '부산 연제구 월드컵대로164번길 9, 2층 202호 (연산동,해원빌딩)' },
  { seq: 1834, row: 1835, name: '넷비즈', bno: '6210947372', ceo: '엄영섭', addr: '부산 금정구 서동로88번길 17-10 (서동)' },
  { seq: 1835, row: 1836, name: '시스넷정보통신', bno: '6210843554', ceo: '오상탁', addr: '부산 금정구 서동중심로51번길 20(서동)' },
  { seq: 1836, row: 1837, name: '아이스퀘어', bno: '3806700724', ceo: '이남호', addr: '부산 영도구 봉래나루로 33, 103호 (대교동1가,부산관광기업지원센터)' },
  { seq: 1837, row: 1838, name: '제이코어', bno: '1011664313', ceo: '이지예', addr: '부산 연제구 연수로 110, 101동 1101호 (연산동,연산경동메르빌아파트)' }
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
