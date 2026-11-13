const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const targetFiles = [
  'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
  'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
  'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx'
];

const updates = [
  { no: 1049, row: 1050, name: '(주)바이너리티', phone: '010-9847-5882' },
  { no: 1054, row: 1055, name: '(주)혜성씨앤디', phone: '010-5343-7925' },
  { no: 1185, row: 1186, name: '(주)찬란한미래', phone: '010-3244-9161' }
];

async function applyUpdatesToFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${filePath}`);
    return;
  }
  
  console.log(`\n==========================================`);
  console.log(`Processing: ${path.basename(filePath)}`);
  
  const tempReadPath = `temp_read_${Date.now()}.xlsx`;
  const tempWritePath = `temp_write_${Date.now()}.xlsx`;
  
  try {
    fs.copyFileSync(filePath, tempReadPath);
    
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(tempReadPath);
    const ws = wb.worksheets[0];
    
    // Check if this sheet matches our expected structure (C1: 순번 or C1: 작성자)
    const h1 = ws.getRow(1).getCell(1).value;
    console.log(`Header 1: ${h1}`);
    
    if (h1 === '순번') {
      // 17-column format (순번, 기업명, 대표자명... Col 10: 전화번호)
      updates.forEach(u => {
        // double check by finding matching row by brno or no
        let targetRow = ws.getRow(u.row);
        if (targetRow.getCell(1).value !== u.no) {
          console.log(`Row number mismatch at ${u.row}: found ${targetRow.getCell(1).value}, searching for ${u.no}...`);
          ws.eachRow((r, rNum) => {
            if (r.getCell(1).value === u.no) {
              targetRow = r;
            }
          });
        }
        
        console.log(`Updating Row ${targetRow.number} (연번 ${u.no} ${u.name}):`);
        console.log(`  Before: Col 10 = ${targetRow.getCell(10).value}`);
        
        const cell = targetRow.getCell(10);
        cell.value = u.phone;
        cell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FF006100' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
        
        console.log(`  After:  Col 10 = ${cell.value} (Green style applied)`);
      });
    } else {
      console.log(`Non-standard header in sheet 0 (${h1}), skipping or searching by company name...`);
    }
    
    await wb.xlsx.writeFile(tempWritePath);
    fs.copyFileSync(tempWritePath, filePath);
    console.log(`Successfully updated and saved: ${path.basename(filePath)}`);
  } catch(e) {
    console.error(`Error processing ${filePath}:`, e.message);
  } finally {
    if (fs.existsSync(tempReadPath)) fs.unlinkSync(tempReadPath);
    if (fs.existsSync(tempWritePath)) fs.unlinkSync(tempWritePath);
  }
}

async function run() {
  for (const fp of targetFiles) {
    await applyUpdatesToFile(fp);
  }
  
  // Verification
  console.log('\n=== VERIFICATION ===');
  for (const fp of targetFiles) {
    if (!fs.existsSync(fp)) continue;
    const wb = new ExcelJS.Workbook();
    const tempVerify = `temp_verify_${Date.now()}.xlsx`;
    fs.copyFileSync(fp, tempVerify);
    await wb.xlsx.readFile(tempVerify);
    const ws = wb.worksheets[0];
    if (ws.getRow(1).getCell(1).value === '순번') {
      console.log(`\nVerified: ${path.basename(fp)}`);
      updates.forEach(u => {
        let r = ws.getRow(u.row);
        if (r.getCell(1).value !== u.no) {
          ws.eachRow((row) => { if (row.getCell(1).value === u.no) r = row; });
        }
        const cell = r.getCell(10);
        console.log(`  Row ${r.number} [${u.name}]: ${cell.value} | font: ${cell.font?.color?.argb} | fill: ${cell.fill?.fgColor?.argb}`);
      });
    }
    fs.unlinkSync(tempVerify);
  }
}
run();
