const fs = require('fs');

const srcTsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.tsv';
const destCsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.csv';

const header = [
  '담당자',
  '상태',
  '상호명',
  '사업자등록번호',
  '대표자명',
  '우편번호',
  '회사주소',
  '전화번호',
  '팩스번호',
  '홈페이지',
  '회사이메일',
  '종업원수',
  '업종_종목',
  '법인등록번호',
  '결산월',
  '대분류',
  '중분류',
  '소분류_비즈인포산업명'
];

const content = fs.readFileSync(srcTsv, 'utf8');
const lines = content.split('\n').filter(l => l.trim().length > 0);

function escapeCsvCol(val) {
  if (val === null || val === undefined) val = '';
  val = String(val).trim();
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const csvRows = [];
csvRows.push(header.map(escapeCsvCol).join(','));

lines.forEach(line => {
  const cols = line.split('\t');
  while (cols.length < 18) cols.push('');
  csvRows.push(cols.map(escapeCsvCol).join(','));
});

// Write with UTF-8 BOM for Excel compatibility
fs.writeFileSync(destCsv, '\uFEFF' + csvRows.join('\r\n'), 'utf8');

console.log(`Saved ${csvRows.length} rows (including header) to ${destCsv}`);
