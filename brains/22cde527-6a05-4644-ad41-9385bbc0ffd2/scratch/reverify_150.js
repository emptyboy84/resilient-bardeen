process.env.NODE_PATH = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules';
require('module').Module._initPaths();
const fs = require('fs');
const ExcelJS = require('exceljs');

function isValidBizNo(b) {
  if (!b) return false;
  const clean = b.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
  const d9 = Number(clean[8]) * 5;
  sum += Math.floor(d9 / 10) + (d9 % 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(clean[9]);
}

async function verify150() {
  const cache = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/details_cache_150.json', 'utf8'));
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx');
  const ws = wb.getWorksheet(1);
  
  let validBiznoCount = 0;
  let invalidBizno = [];
  let auditedRows = [];
  
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const bizno = row.getCell(4).value ? String(row.getCell(4).value).trim() : '';
    const source = row.getCell(19).value ? String(row.getCell(19).value).trim() : '';
    
    // Only check the ones that were populated from our process (source has bizno or modusign or FT)
    if (source && (source.includes('bizno.net') || source.includes('ftc.go.kr') || source.includes('modusign'))) {
      const isValid = isValidBizNo(bizno);
      if (isValid) validBiznoCount++;
      else invalidBizno.push({ row: r, name: row.getCell(3).value, bizno });
      
      auditedRows.push({
        rowNumber: r,
        seq: row.getCell(2).value,
        name: row.getCell(3).value,
        bizno: bizno,
        isValidBizno: isValid,
        year: row.getCell(5).value,
        month: row.getCell(6).value,
        ceo: row.getCell(7).value,
        tel: row.getCell(8).value,
        fax: row.getCell(9).value,
        gu: row.getCell(10).value,
        addr: row.getCell(11).value,
        category: row.getCell(12).value,
        closedDate: row.getCell(14).value,
        employees: row.getCell(16).value,
        source: source
      });
    }
  }
  
  console.log('Audited rows count:', auditedRows.length);
  console.log('Valid BizNo count:', validBiznoCount);
  console.log('Invalid BizNo count:', invalidBizno.length, invalidBizno);
  
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/audit_150_reverified.json', JSON.stringify(auditedRows, null, 2), 'utf8');
}

verify150();
