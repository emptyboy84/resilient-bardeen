const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function fillExistingMatches() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  console.log(`Loading user workbook: ${filePath}`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};
  const stage4 = fs.existsSync('stage4_verified_results.json') ? JSON.parse(fs.readFileSync('stage4_verified_results.json', 'utf8')) : {};

  // Customer center filter relaxation: strictly block only known portal CS numbers
  const STRICT_PORTAL_CS_BLACKLIST = new Set([
    '02-6226-5000', '02-6937-0035', '02-6937-0039',
    '02-3771-1514', '1588-9356', '1588-3333',
    '1577-0000', '02-1577-0000', '02-2008-8888',
    '1588-0114', '114-114', '02-114'
  ]);

  let filledCount = 0;
  const filledList = [];

  for (let r = 498; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const currentPhone = row.getCell(10).value;
    
    // Only fill if currently empty
    if (!currentPhone) {
      const bnoRaw = row.getCell(6).value;
      const bno = String(bnoRaw || '').replace(/[^0-9]/g, '');
      
      const s4 = stage4[bno];
      const s3 = stage3[bno];
      const s2 = stage2[bno];
      const s1 = stage1[bno];
      
      let candidate = s4?.phone || s3?.phone || s2?.phone || s1?.phone;
      if (candidate) {
        candidate = candidate.trim();
        // Check relaxed filter
        if (!STRICT_PORTAL_CS_BLACKLIST.has(candidate) && !/^051-[0-9]{3}-(?:0200|2200|6200|7200|9200)$/.test(candidate)) {
          // Fill phone
          const cell = row.getCell(10);
          cell.value = candidate;
          // Apply red font matching user's style
          cell.font = { color: { argb: 'FFFF0000' } };
          
          filledCount++;
          if (filledList.length < 10) {
            filledList.push({ row: r, seq: row.getCell(1).value, name: row.getCell(2).value, phone: candidate });
          }
        }
      }
    }
  }

  console.log(`\n=== 1차 고속 정합 완료 보고 ===`);
  console.log(`Row 498부터 채워넣은 신규 번호: ${filledCount}개사`);
  console.log(`샘플 발굴 내역 (처음 10개):`, filledList);

  // Save safely
  try {
    await wb.xlsx.writeFile(filePath);
    console.log(`Successfully updated ${filePath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const altPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_진행1차.xlsx';
      await wb.xlsx.writeFile(altPath);
      console.log(`[Notice] File is open in Excel. Saved copy to: ${altPath}`);
    } else {
      throw err;
    }
  }
}

fillExistingMatches().catch(e => console.error('Error:', e));
