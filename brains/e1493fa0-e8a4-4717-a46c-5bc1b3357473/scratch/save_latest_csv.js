const fs = require('fs');
const path = require('path');
const todayDir = 'C:/Users/lg/Desktop/오늘';

function toCsvRow(cells) {
  return cells.map(val => {
    const s = String(val === undefined || val === null ? '' : val).trim();
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }).join(',');
}

const headers17 = ['비고', '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호', '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월', '업종_대', '업종_중', '업종_소'];
const lines17 = fs.readFileSync('rows_15001_15200_17col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);
const csv17 = '\uFEFF' + [toCsvRow(headers17), ...lines17.map(l => toCsvRow(l.split('\t')))].join('\r\n');

const file = path.join(todayDir, '배현명_실사DB_200개기업_17컬럼_검증완료_최신.csv');
fs.writeFileSync(file, csv17, 'utf-8');
console.log('Successfully saved to:', file);
