const fs = require('fs');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const bhmRows = [];
let seq = 0;
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    seq++;
    bhmRows.push({ seq, lineNum: i + 1, cols });
  }
}

// Problem Categories:
// 1. 폐업 기업 (Closed)
// 2. 가동 중이나 전화번호 누락 (Active but No Phone)
// 3. 대표자명 누락 (Missing Rep)
// 4. 주소 누락 (Missing Address)
// 5. 비즈노/국세청 미등록 또는 식별 불가 (Lookup Failed)

const closedList = [];
const noPhoneList = [];
const missingRepList = [];
const missingAddrList = [];
const failedLookupList = [];

bhmRows.forEach(r => {
  const note = (r.cols[1] || '').trim();
  const company = (r.cols[2] || '').trim();
  const bizNo = (r.cols[3] || '').trim();
  const rep = (r.cols[4] || '').trim();
  const zip = (r.cols[5] || '').trim();
  const addr = (r.cols[6] || '').trim();
  const phone = (r.cols[7] || '').trim();
  const nice = (r.cols[17] || '').trim();

  const isClosed = note === '폐업';

  if (isClosed) {
    closedList.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, phone, addr, reason: '국세청 폐업 확인' });
  } else {
    // If not closed, check for other issues
    if (!phone) {
      noPhoneList.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, addr, reason: '전화번호 부재 (연락 불가)' });
    }
  }

  if (!rep) {
    missingRepList.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, isClosed, reason: '대표자명 누락' });
  }

  if (!addr || !zip) {
    missingAddrList.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, reason: !addr ? '주소 누락' : '우편번호 누락' });
  }

  if (!nice && !addr && !phone) {
    failedLookupList.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, reason: 'DB 조회 불가/식별 안됨' });
  }
});

console.log(`=== Problem Analysis Summary ===`);
console.log(`1. 폐업 확인 기업: ${closedList.length}건`);
console.log(`2. 계속사업자 중 전화번호 누락 (통화 불가): ${noPhoneList.length}건`);
console.log(`3. 대표자명 미확인: ${missingRepList.length}건`);
console.log(`4. 주소/우편번호 누락: ${missingAddrList.length}건`);
console.log(`5. 기업 식별/조회 실패: ${failedLookupList.length}건`);

console.log('\n--- Details of Active Companies with No Phone (전화번호 없는 정상사업자 목록) ---');
noPhoneList.forEach(c => {
  console.log(`[순번 ${c.seq} / 원본행 ${c.lineNum}] ${c.company} | 사업자: ${c.bizNo} | 대표: ${c.rep || '미상'} | 주소: ${c.addr || '미상'}`);
});

console.log('\n--- Details of Missing Reps (대표자명 누락) ---');
missingRepList.forEach(c => {
  console.log(`[순번 ${c.seq} / 원본행 ${c.lineNum}] ${c.company} | 사업자: ${c.bizNo} | 폐업여부: ${c.isClosed ? '폐업' : '가동'}`);
});

console.log('\n--- Details of Missing Address (주소/우편번호 누락) ---');
missingAddrList.forEach(c => {
  console.log(`[순번 ${c.seq} / 원본행 ${c.lineNum}] ${c.company} | 사업자: ${c.bizNo} | ${c.reason}`);
});
