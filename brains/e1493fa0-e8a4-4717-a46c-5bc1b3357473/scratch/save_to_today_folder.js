const fs = require('fs');
const path = require('path');

const todayDir = 'C:/Users/lg/Desktop/오늘';
if (!fs.existsSync(todayDir)) {
  fs.mkdirSync(todayDir, { recursive: true });
}

function toCsvRow(cells) {
  return cells.map(val => {
    const s = String(val === undefined || val === null ? '' : val).trim();
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }).join(',');
}

// 17 columns
const headers17 = [
  '비고', '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호',
  '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월',
  '업종_대', '업종_중', '업종_소'
];

// 16 columns
const headers16 = [
  '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호',
  '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월',
  '업종_대', '업종_중', '업종_소'
];

// 18 columns
const headers18 = [
  '작성자', '비고', '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호',
  '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월',
  '업종_대', '업종_중', '업종_소'
];

const lines17 = fs.readFileSync('rows_15001_15200_17col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);
const lines16 = fs.readFileSync('rows_15001_15200_16col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);
const lines18 = fs.readFileSync('rows_15001_15200_18col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);

// Build CSV strings with UTF-8 BOM (\uFEFF)
const csv17 = '\uFEFF' + [toCsvRow(headers17), ...lines17.map(l => toCsvRow(l.split('\t')))].join('\r\n');
const csv16 = '\uFEFF' + [toCsvRow(headers16), ...lines16.map(l => toCsvRow(l.split('\t')))].join('\r\n');
const csv18 = '\uFEFF' + [toCsvRow(headers18), ...lines18.map(l => toCsvRow(l.split('\t')))].join('\r\n');

// Target file paths
const file17 = path.join(todayDir, '배현명_실사DB_200개기업_17컬럼_검증완료.csv');
const file16 = path.join(todayDir, '배현명_실사DB_200개기업_16컬럼_검증완료.csv');
const file18 = path.join(todayDir, '배현명_실사DB_200개기업_18컬럼_작성자포함.csv');

fs.writeFileSync(file17, csv17, 'utf-8');
fs.writeFileSync(file16, csv16, 'utf-8');
fs.writeFileSync(file18, csv18, 'utf-8');

console.log('Successfully written 3 CSV files to', todayDir);
console.log('1. ', file17, '(', fs.statSync(file17).size, 'bytes )');
console.log('2. ', file16, '(', fs.statSync(file16).size, 'bytes )');
console.log('3. ', file18, '(', fs.statSync(file18).size, 'bytes )');
