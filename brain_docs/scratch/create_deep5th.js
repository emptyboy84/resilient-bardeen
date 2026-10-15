const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');
const path = require('path');

async function createDeep5th() {
  const f_src = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
  const f_out5 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층5차.xlsx';
  const f_txt = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';

  console.log(`Loading base file: ${f_src}`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f_src);
  const ws = wb.worksheets[0];

  console.log('Worksheet title:', ws.name);
  console.log('Total rows:', ws.rowCount);

  const greenFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFC6EFCE' }
  };

  const greenFont = {
    bold: true,
    color: { argb: 'FF006100' }
  };

  // Verified updates mapping by sequence number
  const updates = {
    281: '070-4693-7034', // 인코어 (user manual input verified)
    282: '070-7122-7679', // (주)스페이스포트
    305: '051-714-1070',  // (주)에스아이엠테크
    315: '051-711-0305',  // (주)웨이브그램
    318: '0504-1361-2922',// (주)온클레브
    323: '051-791-2021',  // (주)테렌즈
    327: '070-4231-0729', // (주)지앨
    335: '010-4343-7707', // (주)비에이블랩
    336: '1833-7169',     // (주)레드에셋
    344: '051-711-0805',  // 언커먼랩(주)
    356: '010-3135-3104', // (주)내방니방
    366: '070-4012-1862', // (주)새온아이티
    367: '070-7704-5700', // (주)호랑이얼굴
    391: '1644-1664',     // (주)팀리부뜨
    415: '1670-0260',     // (주)나인박스 (마스킹 해제)
    440: '0507-1301-6920',// (주)사운드리더 (마스킹 해제)
    447: '1551-8880',     // (주)빅웨이브카 (마스킹 해제)
    460: '02-830-7036'    // 나눔솔루션
  };

  let updateCount = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const seq = ws.getRow(r).getCell(1).value;
    if (seq !== null && seq !== undefined && updates[Number(seq)]) {
      const cell = ws.getRow(r).getCell(10);
      cell.value = updates[Number(seq)];
      cell.fill = greenFill;
      cell.font = greenFont;
      updateCount++;
    }
  }

  console.log(`Updated ${updateCount} target cells with verified phone numbers & green style.`);

  // Count green cells across the whole workbook
  let totalGreen = 0;
  let totalFilled = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const cell = ws.getRow(r).getCell(10);
    const val = (cell.value || '').toString().trim();
    if (val) totalFilled++;
    if (cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb === 'FFC6EFCE') {
      totalGreen++;
    }
  }

  console.log(`Total filled phone numbers in 심층5차: ${totalFilled}`);
  console.log(`Total green highlighted phone cells in 심층5차: ${totalGreen}`);

  // Save to 심층5차.xlsx
  console.log(`Saving to: ${f_out5}`);
  await wb.xlsx.writeFile(f_out5);
  console.log('심층5차.xlsx successfully created!');

  // Also write TXT file in exact same format as existing text dump
  console.log(`Writing TXT file to: ${f_txt}`);
  const lines = [];
  for (let r = 1; r <= ws.rowCount; r++) {
    const rowVals = [];
    for (let c = 1; c <= ws.columnCount; c++) {
      const v = ws.getRow(r).getCell(c).value;
      rowVals.push(v !== null && v !== undefined ? String(v) : '');
    }
    lines.push(rowVals.join('\t'));
  }
  fs.writeFileSync(f_txt, '\uFEFF' + lines.join('\n'), 'utf-8');
  console.log('TXT file successfully updated!');
}

createDeep5th().catch(console.error);
