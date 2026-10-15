const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');
const path = require('path');

async function applyBatch1AndSave() {
  const f_target = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const f_outExcel = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명_전화번호통합검증_261015.xlsx';
  const f_outTsv = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data\\phone_numbers_merged_261015.tsv';

  console.log('Reading intermediate merged data...');
  const mergedPath = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data\\merged_step1.json';
  const allRows = JSON.parse(fs.readFileSync(mergedPath, 'utf-8'));

  // Batch 1 verified numbers
  const batch1Verified = {
    305: { phone: '051-714-1070', source: '114.co.kr / 공식홈 simtk.co.kr' },
    315: { phone: '051-711-0305', source: '공식홈 wavegram.co.kr' },
    318: { phone: '0504-1361-2922', source: '공식 안심번호 onclev' },
    323: { phone: '051-791-2021', source: 'AI바우처 공급기업DB' },
    327: { phone: '070-4231-0729', source: '공식홈 glcompany.kr' },
    335: { phone: '010-4343-7707', source: '게임잡 공식채용공고' },
    336: { phone: '1833-7169', source: '공식 대표번호 BCC' },
    344: { phone: '051-711-0805', source: '공식홈 uncommonlab.org' },
    356: { phone: '010-3135-3104', source: '인천시/FTC 통신판매등록' },
    366: { phone: '070-4012-1862', source: '공식홈 saeonit.co.kr' },
    367: { phone: '070-7704-5700', source: '공식홈 tigerface.co.kr' },
    391: { phone: '1644-1664', source: '공식 대표번호 reboott.ai' },
    415: { phone: '1670-0260', source: '공식 대표번호 9box.kr' },
    440: { phone: '0507-1301-6920', source: '공식 고객센터 soundleader.co.kr' },
    447: { phone: '1551-8880', source: '공식 고객센터 saveparts.co.kr' },
    460: { phone: '02-830-7036', source: '공식홈 nanumsol.com' }
  };

  let batch1Count = 0;
  for (const row of allRows) {
    if (batch1Verified[row.seq]) {
      row.phone = batch1Verified[row.seq].phone;
      row.source = '배치1 딥서치 (' + batch1Verified[row.seq].source + ')';
      batch1Count++;
    }
  }

  console.log(`Applied ${batch1Count} verified phone numbers from Batch 1!`);

  // Count final totals
  let totalFilled = 0;
  let totalEmpty = 0;
  for (const row of allRows) {
    if (row.phone && String(row.phone).trim() !== '') totalFilled++;
    else totalEmpty++;
  }
  console.log(`Current State: Total Filled = ${totalFilled}, Total Empty = ${totalEmpty}`);

  // Now create the new Excel file based on original template
  console.log('Loading template to preserve exact cell styles and formatting...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f_target);
  const ws = wb.worksheets[0];

  // Map allRows by seq
  const rowMapBySeq = new Map();
  allRows.forEach(r => rowMapBySeq.set(r.seq, r));

  for (let r = 2; r <= ws.rowCount; r++) {
    const seq = ws.getRow(r).getCell(1).value;
    if (seq !== null && seq !== undefined && rowMapBySeq.has(Number(seq))) {
      const data = rowMapBySeq.get(Number(seq));
      // Update phone cell (col 10)
      ws.getRow(r).getCell(10).value = data.phone || '';
    }
  }

  console.log(`Writing new Excel file to: ${f_outExcel}`);
  await wb.xlsx.writeFile(f_outExcel);
  console.log('New Excel file saved successfully!');

  // Also write TSV for direct copy-pasting
  console.log(`Writing TSV export to: ${f_outTsv}`);
  const tsvHeader = ['순번', '기업명', '대표자명', '기업상태', '기업유형/형태', '사업자번호', '법인번호', '산업분류', '주소', '전화번호', '데이터출처'];
  const tsvLines = [tsvHeader.join('\t')];

  for (const row of allRows) {
    tsvLines.push([
      row.seq,
      row.name,
      row.ceo,
      row.status,
      row.corpType,
      row.bizNo,
      row.corpNo,
      row.industry,
      row.address,
      row.phone || '',
      row.source
    ].join('\t'));
  }

  fs.writeFileSync(f_outTsv, tsvLines.join('\n'), 'utf-8');
  console.log('TSV export saved successfully!');

  // Save updated master json
  fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data\\merged_step2.json', JSON.stringify(allRows, null, 2), 'utf-8');
}

applyBatch1AndSave().catch(console.error);
