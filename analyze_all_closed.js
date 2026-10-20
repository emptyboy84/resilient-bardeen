const fs = require('fs');

const remainingData = JSON.parse(fs.readFileSync('remaining_2066_scan_results.json', 'utf8'));
const prevData = JSON.parse(fs.readFileSync('status_scan_results.json', 'utf8'));

const allRemaining = Object.values(remainingData);
const allPrev = Object.values(prevData);

const allCompanies = [...allPrev, ...allRemaining];

const closed = allCompanies.filter(x => x.statusCategory === '폐업');
const suspended = allCompanies.filter(x => x.statusCategory === '휴업');

console.log('=== [전체 크레탑 DB 3,978개사 국세청 실시간 전수 조사 완료 보고] ===');
console.log(`총 조사 기업: ${allCompanies.length}개사`);
console.log(`- 폐업자: ${closed.length}개사`);
console.log(`- 휴업자: ${suspended.length}개사`);

console.log('\n--- [폐업 업체 전수 명단] ---');
closed.forEach((x, i) => {
  console.log(`${i + 1}. seqno: ${x.seq} (행 ${x.row}) | 상호: ${x.name} | 대표: ${x.ceo} | 사업자번호: ${x.bno} | 상태: ${x.detail} | 연락처: ${x.phone || x.contact || '없음'} | 주소: ${x.address}`);
});

console.log('\n--- [휴업 업체 전수 명단] ---');
suspended.forEach((x, i) => {
  console.log(`${i + 1}. seqno: ${x.seq} (행 ${x.row}) | 상호: ${x.name} | 대표: ${x.ceo} | 사업자번호: ${x.bno} | 상태: ${x.detail} | 연락처: ${x.phone || x.contact || '없음'} | 주소: ${x.address}`);
});
