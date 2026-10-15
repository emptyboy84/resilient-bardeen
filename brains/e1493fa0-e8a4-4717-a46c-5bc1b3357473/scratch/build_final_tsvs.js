const fs = require('fs');

const inputFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const cacheFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/bizno_200_cache.json';
const indMapFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/industry_map.json';

const rawLines = fs.readFileSync(inputFile, 'utf-8').split(/\r?\n/).filter(l => l.trim().length > 0);
const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
const indMap = JSON.parse(fs.readFileSync(indMapFile, 'utf-8'));

// Specific manual fixes from search_web & verified registries
const manualFixes = {
  '6090731236': { zip: '51401' }, // 주미엔지니어링
  '6090737152': { zip: '51570', addr: '경상남도 창원시 성산구 완암로 3' }, // 지오시스
  '6090774671': { zip: '51542' }, // 성화기계
  '6090858004': { zip: '51375' }, // 두연Tech
  '6090871031': { zip: '51570', addr: '경상남도 창원시 성산구 완암로 3' }, // 성현정밀
  '6090877831': { zip: '51106' }, // 신화기업
  '6091194242': { zip: '51573' }  // 가가이엔지 (창원sk테크노파크)
};

const rows17 = [];
const rows16 = [];
const rows18 = [];

rawLines.forEach((line, idx) => {
  const p = line.split('\t');
  
  const author = '배현명';
  let company = p[2]?.trim() || '';
  let bizno = p[3]?.trim() || '';
  let rep = p[4]?.trim() || '';
  
  // check if rep had quote split (e.g. Row 10: " \t 박진철")
  if (rep === '"' && p[5]?.includes('"')) {
    rep = p[5].replace(/"/g, '').trim();
  } else {
    rep = rep.replace(/"/g, '').trim();
  }

  // Look up cache
  const c = cache[bizno] || {};
  
  // Status:
  let status = '';
  if (c.status === '폐업' || p[1]?.trim() === '폐업' || line.includes('\t폐업\t') || p[7]?.trim() === '폐업') {
    status = '폐업';
  } else if (c.status === '휴업' || p[1]?.trim() === '휴업') {
    status = '휴업';
  } else {
    status = ''; // normal 계속사업자
  }

  // Address
  let addr = '';
  // Check where address is located in original row
  for (let col = 5; col <= 7; col++) {
    const v = p[col]?.trim() || '';
    if (v && (v.includes('시') || v.includes('군') || v.includes('도') || v.includes('로') || v.includes('길'))) {
      if (!addr) addr = v;
    }
  }
  if (manualFixes[bizno]?.addr) addr = manualFixes[bizno].addr;
  else if (!addr && c.addr) addr = c.addr;

  // Zip
  let zip = manualFixes[bizno]?.zip || c.zip || '';

  // Phone
  let phone = '';
  for (let col = 7; col <= 9; col++) {
    const v = p[col]?.trim() || '';
    if (/^0\d{1,2}-\d{3,4}-\d{4}/.test(v) || /^0507-\d{3,4}-\d{4}/.test(v) || /^070-\d{3,4}-\d{4}/.test(v)) {
      if (!phone) phone = v;
    }
  }
  if (!phone && c.phone) phone = c.phone;
  if (phone === '-') phone = '';

  // Fax
  let fax = '';
  for (let col = 8; col <= 10; col++) {
    const v = p[col]?.trim() || '';
    if (v !== phone && (/^0\d{1,2}-\d{3,4}-\d{4}/.test(v) || /^070-\d{3,4}-\d{4}/.test(v))) {
      if (!fax) fax = v;
    }
  }
  if (!fax && c.fax) fax = c.fax;
  if (fax === '-') fax = '';

  // Homepage
  let homepage = '';
  for (let col = 8; col <= 12; col++) {
    const v = p[col]?.trim() || '';
    if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('www.')) {
      if (!homepage) homepage = v;
    }
  }
  if (!homepage && c.homepage) homepage = c.homepage;

  // Email
  let email = '';
  for (let col = 8; col <= 13; col++) {
    const v = p[col]?.trim() || '';
    if (v.includes('@') && !v.includes(' ') && v.includes('.')) {
      if (!email) email = v;
    }
  }
  if (!email && c.email) email = c.email;
  if (email === '-' || email === '*') email = '';

  // Employees
  let employees = '';
  for (let col = 10; col <= 13; col++) {
    const v = p[col]?.trim() || '';
    if (/^\d+$/.test(v) && Number(v) > 0 && Number(v) < 10000 && v !== zip) {
      if (!employees) employees = v;
    }
  }
  if (!employees && c.employees) employees = c.employees;

  // Industry (NICE / Bizno)
  let industry = '';
  for (let col = 10; col <= 14; col++) {
    const v = p[col]?.trim() || '';
    if (v && !/^\d+$/.test(v) && !v.includes('@') && !v.includes('-') && v !== '*' && v.length >= 2) {
      if (!industry) industry = v;
    }
  }
  if (!industry && c.industry) industry = c.industry;

  // Corp number & Fiscal month: Blank for all 200 personal businesses
  const corpNo = '';
  const fiscalMonth = '';

  // Classifications: dae, jung, so
  let dae = c.dae || '';
  let jung = c.jung || '';
  let so = c.so || '';

  if ((!dae || !jung || !so) && industry && indMap[industry]) {
    dae = indMap[industry].d || dae;
    jung = indMap[industry].j || jung;
    so = indMap[industry].s || so;
  }
  if ((!dae || !jung || !so) && c.industry && indMap[c.industry]) {
    dae = indMap[c.industry].d || dae;
    jung = indMap[c.industry].j || jung;
    so = indMap[c.industry].s || so;
  }

  // Build row strings
  // 17col: 상태, 회사명, 사업자번호, 대표자, 우편번호, 주소, 전화번호, 팩스번호, 홈페이지, 이메일, 종업원수, 업종, 법인번호, 결산월, 업종_대, 업종_중, 업종_소
  const r17 = [status, company, bizno, rep, zip, addr, phone, fax, homepage, email, employees, industry, corpNo, fiscalMonth, dae, jung, so];
  rows17.push(r17.join('\t'));

  // 16col: 회사명, 사업자번호, 대표자, 우편번호, 주소, 전화번호, 팩스번호, 홈페이지, 이메일, 종업원수, 업종, 법인번호, 결산월, 업종_대, 업종_중, 업종_소
  const r16 = [company, bizno, rep, zip, addr, phone, fax, homepage, email, employees, industry, corpNo, fiscalMonth, dae, jung, so];
  rows16.push(r16.join('\t'));

  // 18col: 작성자, 상태, 회사명, 사업자번호, 대표자, 우편번호, 주소, 전화번호, 팩스번호, 홈페이지, 이메일, 종업원수, 업종, 법인번호, 결산월, 업종_대, 업종_중, 업종_소
  const r18 = [author, status, company, bizno, rep, zip, addr, phone, fax, homepage, email, employees, industry, corpNo, fiscalMonth, dae, jung, so];
  rows18.push(r18.join('\t'));
});

console.log('Finished processing 200 rows.');
fs.writeFileSync('rows_15001_15200_17col.tsv', rows17.join('\n'), 'utf-8');
fs.writeFileSync('rows_15001_15200_16col.tsv', rows16.join('\n'), 'utf-8');
fs.writeFileSync('rows_15001_15200_18col.tsv', rows18.join('\n'), 'utf-8');
console.log('Saved to rows_15001_15200_17col.tsv, 16col.tsv, 18col.tsv');

console.log('Sample Row 1 (17col):', rows17[0]);
console.log('Sample Row 1 (16col):', rows16[0]);
console.log('Sample Row 1 (18col):', rows18[0]);
