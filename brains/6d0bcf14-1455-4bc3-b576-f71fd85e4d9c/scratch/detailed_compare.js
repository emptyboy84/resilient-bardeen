const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function detailedCompare() {
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

  console.log('Seq | Name | BizNo | Target | Yesterday(1014) | Deep4th');
  console.log('----+------+-------+--------+-----------------+--------');

  for (let r = 2; r <= wsTarget.rowCount; r++) {
    const seq = wsTarget.getRow(r).getCell(1).value;
    if (seq >= 275 && seq <= 315) {
      const name = wsTarget.getRow(r).getCell(2).value;
      const biz = wsTarget.getRow(r).getCell(6).value;
      const pTarget = wsTarget.getRow(r).getCell(10).value || '';
      
      // Match in yesterday by bizNo or seq
      let pYest = '';
      for (let ry = 2; ry <= wsYest.rowCount; ry++) {
        if (wsYest.getRow(ry).getCell(6).value === biz || wsYest.getRow(ry).getCell(1).value === seq) {
          pYest = wsYest.getRow(ry).getCell(10).value || '';
          break;
        }
      }

      // Match in deep4
      let pDeep = '';
      for (let rd = 2; rd <= wsDeep4.rowCount; rd++) {
        if (wsDeep4.getRow(rd).getCell(6).value === biz || wsDeep4.getRow(rd).getCell(1).value === seq) {
          pDeep = wsDeep4.getRow(rd).getCell(10).value || '';
          break;
        }
      }

      console.log(`${seq} | ${name} | ${biz} | T: ${pTarget} | Y: ${pYest} | D4: ${pDeep}`);
    }
  }
}

detailedCompare().catch(console.error);
