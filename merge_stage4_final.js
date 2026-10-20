const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

function getPhoneScore(phone) {
  if (!phone) return 0;
  const p = phone.trim();
  if (p.includes('*')) return 1; // Masked mobile (Score 1)
  if (/^01[016789]-[0-9]{3,4}-[0-9]{4}$/.test(p)) return 2; // Full mobile (Score 2)
  if (/^(?:051|02|031|070|15[0-9]{2}|16[0-9]{2}|18[0-9]{2}|050[0-9]?)-[0-9]{3,4}-[0-9]{4}$|^(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$/.test(p)) return 3; // Full Landline/Rep (Score 3)
  return 1.5; // Other valid
}

async function mergeStage4() {
  const origPath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx';
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};
  const stage4 = fs.existsSync('stage4_verified_results.json') ? JSON.parse(fs.readFileSync('stage4_verified_results.json', 'utf8')) : {};

  console.log(`Loading original file: ${origPath}`);
  console.log(`Available data sources:`);
  console.log(`- Stage 1 (Bizno 1차): ${Object.keys(stage1).length}`);
  console.log(`- Stage 2 (Saramin/Bizno 2차): ${Object.keys(stage2).length}`);
  console.log(`- Stage 3 (Kakao Map): ${Object.keys(stage3).length}`);
  console.log(`- Stage 4 (Daum/Naver/Bizno Multi): ${Object.keys(stage4).length}`);

  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(origPath);
  const wsOrig = wbOrig.worksheets[0];

  const targetDir = 'C:/Users/lg/Desktop/Today';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const wbNew = new ExcelJS.Workbook();
  const wsNew = wbNew.addWorksheet('크레탑_부산CT_전화번호검증');

  const tsvRows = [];
  let totalData = 0;
  let origPhones = 0;
  let newlyFilledPhones = 0;
  let upgradedFromMasked = 0;
  let stillMissing = 0;

  let countLandline = 0;
  let countFullMobile = 0;
  let countMaskedMobile = 0;

  wsOrig.eachRow((row, rowNumber) => {
    const values = [];
    for (let c = 1; c <= 17; c++) {
      values.push(row.getCell(c).value !== null && row.getCell(c).value !== undefined ? String(row.getCell(c).value) : '');
    }

    if (rowNumber === 1) {
      tsvRows.push(values);
      const rNew = wsNew.addRow(values);
      rNew.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      rNew.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E79' }
      };
      rNew.alignment = { vertical: 'middle', horizontal: 'center' };
      return;
    }

    totalData++;
    const bizNo = values[5].replace(/[^0-9]/g, '');
    let phone = values[9].trim();
    let isNew = false;
    let isUpgraded = false;

    if (phone) {
      origPhones++;
    } else {
      // Gather all candidates across all stages
      const candidates = [];

      // Candidate 1: Stage 1 (Bizno)
      if (stage1[bizNo]) {
        candidates.push({ phone: stage1[bizNo], source: 'Stage1-Bizno' });
      }

      // Candidate 2: Stage 2 (Saramin / Bizno)
      if (stage2[bizNo]) {
        const s2 = stage2[bizNo];
        const s2Phone = typeof s2 === 'object' ? s2.phone : s2;
        const s2Source = typeof s2 === 'object' ? s2.source : 'Stage2';
        candidates.push({ phone: s2Phone, source: s2Source });
      }

      // Candidate 3: Stage 3 (Kakao Map)
      if (stage3[bizNo]) {
        candidates.push({ phone: stage3[bizNo].phone, source: 'Stage3-Kakao' });
      }

      // Candidate 4: Stage 4 (Daum / Naver / Multi Deep)
      if (stage4[bizNo]) {
        candidates.push({ phone: stage4[bizNo].phone, source: stage4[bizNo].source });
      }

      if (candidates.length > 0) {
        // Sort by quality score (Score 3: Landline > Score 2: Full Mobile > Score 1: Masked Mobile)
        candidates.sort((a, b) => getPhoneScore(b.phone) - getPhoneScore(a.phone));
        const best = candidates[0];

        // Check if an upgrade occurred (was masked in earlier stage, but now has full phone)
        const hasMasked = candidates.some(c => c.phone.includes('*'));
        if (hasMasked && !best.phone.includes('*')) {
          isUpgraded = true;
          upgradedFromMasked++;
        }

        phone = best.phone;
        values[9] = phone;
        newlyFilledPhones++;
        isNew = true;

        if (best.phone.includes('*')) countMaskedMobile++;
        else if (/^01[016789]-/.test(best.phone)) countFullMobile++;
        else countLandline++;
      } else {
        stillMissing++;
      }
    }

    tsvRows.push(values);
    const rNew = wsNew.addRow(values);

    if (isNew) {
      const cell = rNew.getCell(10);
      cell.font = { bold: true, color: { argb: isUpgraded ? 'FF002060' : 'FF006100' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isUpgraded ? 'FFD9E1F2' : 'FFC6EFCE' }
      };
    }
  });

  // Column widths
  wsNew.columns.forEach((col, i) => {
    col.width = [6, 26, 12, 10, 18, 15, 18, 25, 45, 16, 12, 10, 10, 10, 10, 10, 10][i] || 15;
  });

  const totalWithPhone = origPhones + newlyFilledPhones;
  const pct = ((totalWithPhone / totalData) * 100).toFixed(1);

  console.log(`\n=== Stage 4 Final Deep Merge Statistics ===`);
  console.log(`Total companies: ${totalData}`);
  console.log(`Originally had phone: ${origPhones} (${(origPhones/totalData*100).toFixed(1)}%)`);
  console.log(`Total newly filled phones: ${newlyFilledPhones}`);
  console.log(`  - Full Landline/051/070/Rep: ${countLandline}`);
  console.log(`  - Full Mobile (010): ${countFullMobile}`);
  console.log(`  - Masked Mobile (010-****): ${countMaskedMobile}`);
  console.log(`Upgraded from masked to full phone: ${upgradedFromMasked}`);
  console.log(`Total with phone now: ${totalWithPhone} (${pct}%)`);
  console.log(`Still missing: ${stillMissing}`);

  // 1. Save TXT
  const txtFileName = '크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  const txtFilePath = path.join(targetDir, txtFileName);
  const tsvText = '\uFEFF' + tsvRows.map(r => r.join('\t')).join('\n');
  fs.writeFileSync(txtFilePath, tsvText, 'utf8');
  console.log(`Saved TXT to: ${txtFilePath} (${fs.statSync(txtFilePath).size} bytes)`);

  // 2. Save XLSX (handle lock gracefully)
  const xlsxFileName = '크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  const xlsxFilePath = path.join(targetDir, xlsxFileName);
  try {
    await wbNew.xlsx.writeFile(xlsxFilePath);
    console.log(`Saved XLSX to: ${xlsxFilePath} (${fs.statSync(xlsxFilePath).size} bytes)`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const altFileName = '크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
      const altFilePath = path.join(targetDir, altFileName);
      await wbNew.xlsx.writeFile(altFilePath);
      console.log(`[Notice] Primary file is open in Excel. Saved updated copy to: ${altFilePath} (${fs.statSync(altFilePath).size} bytes)`);
    } else {
      throw err;
    }
  }
}

mergeStage4();
