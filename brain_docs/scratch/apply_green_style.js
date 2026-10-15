const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');

async function applyGreenStyle() {
  const f_original = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const f_target = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명_전화번호통합검증_261015.xlsx';
  const f_deep4 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';

  console.log('Loading target file to apply green style...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f_target);
  const ws = wb.worksheets[0];

  console.log('Loading deep4 to see which were originally green...');
  const wbDeep4 = new ExcelJS.Workbook();
  await wbDeep4.xlsx.readFile(f_deep4);
  const wsDeep4 = wbDeep4.worksheets[0];

  // Deep4 green seq set
  const deep4GreenSeqs = new Set();
  for (let r = 2; r <= wsDeep4.rowCount; r++) {
    const seq = wsDeep4.getRow(r).getCell(1).value;
    const c10 = wsDeep4.getRow(r).getCell(10);
    if (c10.fill && c10.fill.fgColor && c10.fill.fgColor.argb === 'FFC6EFCE') {
      if (seq) deep4GreenSeqs.add(Number(seq));
    }
  }

  // 16 newly verified from Batch 1
  const batch1Seqs = new Set([305, 315, 318, 323, 327, 335, 336, 344, 356, 366, 367, 391, 415, 440, 447, 460]);

  // Load original raw file to know which rows were originally empty
  console.log('Loading original file to identify empty rows...');
  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(f_original);
  const wsOrig = wbOrig.worksheets[0];
  const origEmptySeqs = new Set();
  for (let r = 2; r <= wsOrig.rowCount; r++) {
    const seq = wsOrig.getRow(r).getCell(1).value;
    const p = (wsOrig.getRow(r).getCell(10).value || '').toString().trim();
    if (!p) {
      if (seq) origEmptySeqs.add(Number(seq));
    }
  }

  const greenFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFC6EFCE' }
  };

  const greenFont = {
    name: '맑은 고딕',
    size: 10,
    bold: true,
    color: { argb: 'FF006100' }
  };

  let appliedCount = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const seq = ws.getRow(r).getCell(1).value;
    if (seq === null || seq === undefined) continue;
    const numSeq = Number(seq);
    const cell10 = ws.getRow(r).getCell(10);
    const currentVal = (cell10.value || '').toString().trim();

    // If it has a value, and (was green in deep4 OR is in batch1 OR was originally empty and now has a phone OR seq is 281/282)
    if (currentVal && (deep4GreenSeqs.has(numSeq) || batch1Seqs.has(numSeq) || origEmptySeqs.has(numSeq) || numSeq === 281 || numSeq === 282)) {
      cell10.fill = greenFill;
      cell10.font = greenFont;
      appliedCount++;
    }
  }

  console.log(`Total cells styled in green (연한 초록 배경 + 진한 초록 굵은 글씨): ${appliedCount}`);

  // Save safely
  try {
    await wb.xlsx.writeFile(f_target);
    console.log(`Successfully saved styled Excel to: ${f_target}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const altFile = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명_전화번호통합검증_261015_초록서식.xlsx';
      console.log(`File is busy/open in Excel. Saving to alternative file: ${altFile}`);
      await wb.xlsx.writeFile(altFile);
      console.log(`Saved to ${altFile} successfully!`);
    } else {
      throw err;
    }
  }
}

applyGreenStyle().catch(console.error);
