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

// Updated data for 신영산업 (6090695719)
const updatedObj = {
  author: '배현명',
  status: '', // 계속사업자
  company: '신영산업',
  bizno: '6090695719',
  rep: '양기우',
  zip: '51399',
  addr: '경상남도 창원시 의창구 죽전로 6',
  phone: '055-551-5958',
  fax: '055-297-4701',
  homepage: '',
  email: 'sinteck@daum.net',
  employees: '8',
  industry: '주형 및 금형 제조업',
  corpNo: '',
  fiscalMonth: '',
  dae: '제조업',
  jung: '기타 기계 및 장비 제조업',
  so: '특수 목적용 기계 제조업'
};

const r17 = [
  updatedObj.status, updatedObj.company, updatedObj.bizno, updatedObj.rep, updatedObj.zip,
  updatedObj.addr, updatedObj.phone, updatedObj.fax, updatedObj.homepage, updatedObj.email,
  updatedObj.employees, updatedObj.industry, updatedObj.corpNo, updatedObj.fiscalMonth,
  updatedObj.dae, updatedObj.jung, updatedObj.so
];

const r16 = [
  updatedObj.company, updatedObj.bizno, updatedObj.rep, updatedObj.zip,
  updatedObj.addr, updatedObj.phone, updatedObj.fax, updatedObj.homepage, updatedObj.email,
  updatedObj.employees, updatedObj.industry, updatedObj.corpNo, updatedObj.fiscalMonth,
  updatedObj.dae, updatedObj.jung, updatedObj.so
];

const r18 = [
  updatedObj.author, updatedObj.status, updatedObj.company, updatedObj.bizno, updatedObj.rep,
  updatedObj.zip, updatedObj.addr, updatedObj.phone, updatedObj.fax, updatedObj.homepage,
  updatedObj.email, updatedObj.employees, updatedObj.industry, updatedObj.corpNo,
  updatedObj.fiscalMonth, updatedObj.dae, updatedObj.jung, updatedObj.so
];

// 1. Update workspace TSVs
const tsvFiles = [
  { path: 'rows_15001_15200_17col.tsv', row: r17.join('\t') },
  { path: 'rows_15001_15200_16col.tsv', row: r16.join('\t') },
  { path: 'rows_15001_15200_18col.tsv', row: r18.join('\t') }
];

tsvFiles.forEach(f => {
  if (fs.existsSync(f.path)) {
    const lines = fs.readFileSync(f.path, 'utf-8').split('\n');
    lines[22] = f.row; // row index 22 is 23rd line
    fs.writeFileSync(f.path, lines.join('\n'), 'utf-8');
  }
});

// 2. Re-export Desktop/오늘 CSVs
const lines17 = fs.readFileSync('rows_15001_15200_17col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);
const lines16 = fs.readFileSync('rows_15001_15200_16col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);
const lines18 = fs.readFileSync('rows_15001_15200_18col.tsv', 'utf-8').split('\n').filter(l => l.length > 0);

const headers17 = ['비고', '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호', '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월', '업종_대', '업종_중', '업종_소'];
const headers16 = ['회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호', '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월', '업종_대', '업종_중', '업종_소'];
const headers18 = ['작성자', '비고', '회사명', '사업자번호', '대표자', '우편번호', '주소', '전화번호', '팩스번호', '홈페이지', '이메일', '종업원수', '업종(NICE BizINFO(업종)참고', '법인번호', '결산월', '업종_대', '업종_중', '업종_소'];

const csv17 = '\uFEFF' + [toCsvRow(headers17), ...lines17.map(l => toCsvRow(l.split('\t')))].join('\r\n');
const csv16 = '\uFEFF' + [toCsvRow(headers16), ...lines16.map(l => toCsvRow(l.split('\t')))].join('\r\n');
const csv18 = '\uFEFF' + [toCsvRow(headers18), ...lines18.map(l => toCsvRow(l.split('\t')))].join('\r\n');

fs.writeFileSync(path.join(todayDir, '배현명_실사DB_200개기업_17컬럼_검증완료.csv'), csv17, 'utf-8');
fs.writeFileSync(path.join(todayDir, '배현명_실사DB_200개기업_16컬럼_검증완료.csv'), csv16, 'utf-8');
fs.writeFileSync(path.join(todayDir, '배현명_실사DB_200개기업_18컬럼_작성자포함.csv'), csv18, 'utf-8');

console.log('Successfully updated 신영산업 across all TSVs and Desktop/오늘 CSVs.');
console.log('New line 23 in 17col:', r17.join('\t'));
