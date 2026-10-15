const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');

async function analyzeMerge() {
  const f_target = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const f_yesterday = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx';
  const f_deep4 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';

  const wbTarget = new ExcelJS.Workbook();
  await wbTarget.xlsx.readFile(f_target);
  const wsTarget = wbTarget.worksheets[0];

  const wbYest = new ExcelJS.Workbook();
  await wbYest.xlsx.readFile(f_yesterday);
  const wsYest = wbYest.worksheets[0];

  const wbDeep4 = new ExcelJS.Workbook();
  await wbDeep4.xlsx.readFile(f_deep4);
  const wsDeep4 = wbDeep4.worksheets[0];

  // Map by bizNo and seq
  const yestMap = new Map();
  for (let r = 2; r <= wsYest.rowCount; r++) {
    const seq = wsYest.getRow(r).getCell(1).value;
    const bizNo = (wsYest.getRow(r).getCell(6).value || '').toString().trim();
    const phone = (wsYest.getRow(r).getCell(10).value || '').toString().trim();
    if (phone) {
      if (bizNo) yestMap.set(bizNo, phone);
      if (seq) yestMap.set(`seq_${seq}`, phone);
    }
  }

  const deep4Map = new Map();
  for (let r = 2; r <= wsDeep4.rowCount; r++) {
    const seq = wsDeep4.getRow(r).getCell(1).value;
    const bizNo = (wsDeep4.getRow(r).getCell(6).value || '').toString().trim();
    const phone = (wsDeep4.getRow(r).getCell(10).value || '').toString().trim();
    if (phone) {
      if (bizNo) deep4Map.set(bizNo, phone);
      if (seq) deep4Map.set(`seq_${seq}`, phone);
    }
  }

  console.log(`Yesterday map size: ${yestMap.size}, Deep4 map size: ${deep4Map.size}`);

  let targetHas = 0;
  let canFillFromYest = 0;
  let canFillFromDeep4 = 0;
  let stillEmpty = 0;
  let maskedInDeep4 = 0;

  for (let r = 2; r <= wsTarget.rowCount; r++) {
    const seq = wsTarget.getRow(r).getCell(1).value;
    const bizNo = (wsTarget.getRow(r).getCell(6).value || '').toString().trim();
    const curPhone = (wsTarget.getRow(r).getCell(10).value || '').toString().trim();

    if (curPhone) {
      targetHas++;
    } else {
      const pYest = yestMap.get(bizNo) || yestMap.get(`seq_${seq}`);
      const pDeep = deep4Map.get(bizNo) || deep4Map.get(`seq_${seq}`);

      if (pYest && !pYest.includes('*')) {
        canFillFromYest++;
      } else if (pDeep) {
        if (pDeep.includes('*')) {
          maskedInDeep4++;
        } else {
          canFillFromDeep4++;
        }
      } else {
        stillEmpty++;
      }
    }
  }

  console.log(`Target currently has: ${targetHas}`);
  console.log(`Can fill from Yesterday (clean): ${canFillFromYest}`);
  console.log(`Can fill from Deep4 (clean): ${canFillFromDeep4}`);
  console.log(`Masked in Deep4 (needs unmasking/deep search): ${maskedInDeep4}`);
  console.log(`Still completely empty (needs deep search): ${stillEmpty}`);
}

analyzeMerge().catch(console.error);
