const fs = require('fs');

const results = JSON.parse(fs.readFileSync('status_scan_results.json', 'utf8'));
const list = Object.values(results);

const closed = list.filter(x => x.statusCategory === '폐업');
const suspended = list.filter(x => x.statusCategory === '휴업');
const normal = list.filter(x => x.statusCategory === '정상');
const other = list.filter(x => x.statusCategory !== '정상' && x.statusCategory !== '폐업' && x.statusCategory !== '휴업');

console.log('=== [전체 1,179개사 국세청 실시간 상태 전수 조사 결과] ===');
console.log('총 조사 대상 기업 수:', list.length);
console.log('- 정상 (계속사업자):', normal.length, `(${(normal.length/list.length*100).toFixed(1)}%)`);
console.log('- 폐업자:', closed.length);
console.log('- 휴업자:', suspended.length);
console.log('- 미등록 / 번호미기재 (등기 전용 등):', other.length);

console.log('\n=== [★ 선별된 폐업 및 휴업 기업 명단] ===');
const targetList = [...closed, ...suspended];
if (targetList.length === 0) {
  console.log('폐업 및 휴업 기업이 0건입니다.');
} else {
  targetList.forEach((x, i) => {
    console.log(`${i + 1}. seqno: ${x.seq} | 엑셀행: ${x.row} | 상호: ${x.name} | 대표: ${x.ceo} | 사업자번호: ${x.bno} | 전화번호: ${x.phone} | 상태: ${x.statusCategory} | 상세: ${x.detail} | 출처: ${x.source}`);
  });
}

console.log('\n=== [미등록 / 사업자번호 미기재 77건 세부 분류] ===');
console.log('건수:', other.length);
other.slice(0, 10).forEach((x, i) => {
  console.log(`${i + 1}. seqno: ${x.seq} | 행: ${x.row} | 상호: ${x.name} | 대표: ${x.ceo} | 등기번호: ${x.corpNo} | 비고: ${x.detail}`);
});
