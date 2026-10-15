const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');
const path = require('path');

async function runTask1() {
  const f_target = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const f_yesterday = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx';
  const f_deep4 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';

  console.log('Loading target file...');
  const wbTarget = new ExcelJS.Workbook();
  await wbTarget.xlsx.readFile(f_target);
  const wsTarget = wbTarget.worksheets[0];

  console.log('Loading yesterday (20261014)...');
  const wbYest = new ExcelJS.Workbook();
  await wbYest.xlsx.readFile(f_yesterday);
  const wsYest = wbYest.worksheets[0];

  console.log('Loading deep 4th...');
  const wbDeep4 = new ExcelJS.Workbook();
  await wbDeep4.xlsx.readFile(f_deep4);
  const wsDeep4 = wbDeep4.worksheets[0];

  // Helper clean bizNo
  const cleanBiz = (b) => (b ? String(b).replace(/[^0-9]/g, '') : '');

  // 1. Map yesterday numbers
  const yestMap = new Map();
  for (let r = 2; r <= wsYest.rowCount; r++) {
    const biz = cleanBiz(wsYest.getRow(r).getCell(6).value);
    const phone = (wsYest.getRow(r).getCell(10).value || '').toString().trim();
    if (biz && phone && !phone.includes('*')) {
      yestMap.set(biz, phone);
    }
  }

  // 2. Map deep4 numbers
  const deep4Map = new Map();
  const deep4MaskedMap = new Map();
  for (let r = 2; r <= wsDeep4.rowCount; r++) {
    const biz = cleanBiz(wsDeep4.getRow(r).getCell(6).value);
    const phone = (wsDeep4.getRow(r).getCell(10).value || '').toString().trim();
    if (biz && phone) {
      if (phone.includes('*')) {
        deep4MaskedMap.set(biz, phone);
      } else {
        deep4Map.set(biz, phone);
      }
    }
  }

  console.log(`Unique clean numbers from 20261014: ${yestMap.size}`);
  console.log(`Unique clean numbers from Deep4: ${deep4Map.size}`);
  console.log(`Unique masked numbers from Deep4: ${deep4MaskedMap.size}`);

  // 3. Process Target File rows
  const allRows = [];
  let userExistingCount = 0;
  let mergedFromYesterday = 0;
  let mergedFromDeep4 = 0;
  let remainingEmpty = 0;
  let remainingMasked = 0;

  const targetFrom282Missing = [];

  for (let r = 2; r <= wsTarget.rowCount; r++) {
    const row = wsTarget.getRow(r);
    const seq = row.getCell(1).value;
    if (seq === null || seq === undefined || seq === '') continue;

    const name = (row.getCell(2).value || '').toString().trim();
    const ceo = (row.getCell(3).value || '').toString().trim();
    const status = (row.getCell(4).value || '').toString().trim();
    const corpType = (row.getCell(5).value || '').toString().trim();
    const rawBiz = (row.getCell(6).value || '').toString().trim();
    const bizKey = cleanBiz(rawBiz);
    const corpNo = (row.getCell(7).value || '').toString().trim();
    const industry = (row.getCell(8).value || '').toString().trim();
    const address = (row.getCell(9).value || '').toString().trim();
    const curPhone = (row.getCell(10).value || '').toString().trim();
    const recentYear = (row.getCell(11).value || '').toString().trim();

    let finalPhone = curPhone;
    let source = '원본(사용자 유지)';

    if (curPhone) {
      userExistingCount++;
    } else {
      // Try Yest
      if (yestMap.has(bizKey)) {
        finalPhone = yestMap.get(bizKey);
        source = '어제(20261014)';
        mergedFromYesterday++;
      } else if (deep4Map.has(bizKey)) {
        finalPhone = deep4Map.get(bizKey);
        source = '심층4차';
        mergedFromDeep4++;
      } else if (deep4MaskedMap.has(bizKey)) {
        source = '심층4차(마스킹)';
        remainingMasked++;
      } else {
        source = '미확인(누락)';
        remainingEmpty++;
      }
    }

    const rowObj = {
      r,
      seq: Number(seq),
      name,
      ceo,
      status,
      corpType,
      bizNo: rawBiz,
      bizKey,
      corpNo,
      industry,
      address,
      phone: finalPhone,
      source,
      recentYear
    };

    allRows.push(rowObj);

    // If seq >= 282 and phone is still missing or masked
    if (Number(seq) >= 282 && (!finalPhone || finalPhone.includes('*'))) {
      targetFrom282Missing.push(rowObj);
    }
  }

  console.log('=== Task 1 Merge Summary ===');
  console.log(`Total companies: ${allRows.length}`);
  console.log(`User existing maintained: ${userExistingCount}`);
  console.log(`Merged clean from 20261014: ${mergedFromYesterday}`);
  console.log(`Merged clean from Deep4: ${mergedFromDeep4}`);
  console.log(`Total filled so far: ${userExistingCount + mergedFromYesterday + mergedFromDeep4}`);
  console.log(`Remaining masked: ${remainingMasked}`);
  console.log(`Remaining completely empty: ${remainingEmpty}`);
  console.log(`Missing or masked starting from Seq 282: ${targetFrom282Missing.length}`);

  // Save intermediate merged dataset as JSON & TSV in workspace data folder
  const dataDir = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data';
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'merged_step1.json'), JSON.stringify(allRows, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'missing_from_282.json'), JSON.stringify(targetFrom282Missing, null, 2), 'utf-8');

  console.log('First 10 missing/masked from Seq 282:');
  targetFrom282Missing.slice(0, 10).forEach(x => {
    console.log(`Seq ${x.seq} | ${x.name} | 대표: ${x.ceo} | 사업자: ${x.bizNo} | 상태: ${x.source}`);
  });
}

runTask1().catch(console.error);
