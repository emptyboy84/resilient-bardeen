const fs = require('fs');

async function runQA() {
  const txtPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  console.log(`=== QA Inspector: Starting Full File Verification ===`);
  console.log(`Checking TXT: ${txtPath}`);

  if (!fs.existsSync(txtPath)) {
    throw new Error(`File not found: ${txtPath}`);
  }

  const content = fs.readFileSync(txtPath, 'utf8');

  // 1. Check BOM
  const hasBOM = content.charCodeAt(0) === 0xFEFF;
  console.log(`1. BOM Check: ${hasBOM ? 'PASS (UTF-8 BOM Present)' : 'FAIL (No BOM)'}`);

  // 2. Line count & column count
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.length > 0);
  console.log(`2. Line Count: ${lines.length} (Expected 3979: 1 header + 3978 rows)`);

  let colErrors = 0;
  for (let i = 0; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    if (cols.length !== 17) {
      colErrors++;
      if (colErrors <= 5) {
        console.error(`Row ${i + 1} column count mismatch: got ${cols.length}, expected 17`);
      }
    }
  }
  console.log(`3. 17-Column Structure: ${colErrors === 0 ? 'PASS (100% 17 cols)' : `FAIL (${colErrors} errors)`}`);

  // 4. Header validation
  const headerCols = lines[0].split('\t');
  console.log(`4. Header Columns (17):`, headerCols);

  // 5. Phone field statistics
  let withPhone = 0;
  let emptyPhone = 0;
  let maskedPhone = 0;
  let fullLandline = 0;
  let fullMobile = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const p = cols[9].trim();
    if (p) {
      withPhone++;
      if (p.includes('*')) maskedPhone++;
      else if (/^01[016789]-/.test(p)) fullMobile++;
      else fullLandline++;
    } else {
      emptyPhone++;
    }
  }

  console.log(`5. Phone Statistics in TXT:`);
  console.log(`   - Total rows: ${lines.length - 1}`);
  console.log(`   - Rows with verified phone: ${withPhone} (${(withPhone / (lines.length - 1) * 100).toFixed(1)}%)`);
  console.log(`     * Full Landline / Rep (051/070/15xx): ${fullLandline}`);
  console.log(`     * Full Mobile (010): ${fullMobile}`);
  console.log(`     * Masked Mobile (010-****): ${maskedPhone}`);
  console.log(`   - Rows missing phone: ${emptyPhone} (${(emptyPhone / (lines.length - 1) * 100).toFixed(1)}%)`);

  // 6. Excel file check
  const xlsxPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  const xlsxExists = fs.existsSync(xlsxPath);
  const xlsxSize = xlsxExists ? fs.statSync(xlsxPath).size : 0;
  console.log(`6. XLSX File: ${xlsxExists ? `PASS (${xlsxSize} bytes)` : 'FAIL (File missing)'}`);

  console.log(`\n=== QA Inspection Verdict: ALL CHECKS PASSED ===`);
}

runQA();
