const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/node_modules/exceljs');

const tsvPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/merged_500_perfect.tsv';
const excelPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

async function update() {
  // 1. Update merged_500_perfect.tsv
  console.log('Updating TSV...');
  const lines = fs.readFileSync(tsvPath, 'utf-8').trim().split('\n');
  const targetIdx = 404; // 405th line (0-indexed 404)
  console.log('Current TSV line:', lines[targetIdx]);
  
  const updatedTsvLine = '배현명\t\t㈜미우디자인\t5518501580\t장준호\t06176\t서울특별시 강남구 영동대로 416\t02-3484-7788\t02-3484-7789\thttp://www.meewoodesign.com\tmeewoodesign@mw.com\t20 미만\t도배, 실내장식 및 내장 목공사업\t110111-2192526\t12월(추정)\t건 설 업\t전문직별 공사업\t실내건축 및 건축마무리 공사업';
  lines[targetIdx] = updatedTsvLine;
  fs.writeFileSync(tsvPath, lines.join('\n') + '\n', 'utf-8');
  console.log('TSV updated successfully.');

  // 2. Update Excel
  console.log('Updating Excel...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(excelPath);
  const ws = wb.getWorksheet('기업 정보');
  const row = ws.getRow(12251);

  const orangeStyle = {
    font: { charset: 129, family: 3, scheme: 'minor', size: 10, name: '맑은 고딕' },
    border: {
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
      bottom: { style: 'thin' }
    },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFA500' } },
    alignment: { horizontal: 'left', vertical: 'middle' }
  };

  // Col 7 (주소): 서울특별시 강남구 영동대로 416
  row.getCell(7).value = '서울특별시 강남구 영동대로 416';
  row.getCell(7).style = { ...orangeStyle };

  // Col 10 (홈페이지): http://www.meewoodesign.com
  row.getCell(10).value = 'http://www.meewoodesign.com';
  row.getCell(10).style = { ...orangeStyle };

  // Col 11 (이메일): meewoodesign@mw.com
  row.getCell(11).value = 'meewoodesign@mw.com';
  row.getCell(11).style = { ...orangeStyle };

  // Col 48 (업종_대): 건 설 업
  row.getCell(48).value = '건 설 업';
  row.getCell(48).style = { ...orangeStyle };

  // Col 49 (업종_중): 전문직별 공사업
  row.getCell(49).value = '전문직별 공사업';
  row.getCell(49).style = { ...orangeStyle };

  // Col 50 (업종_소): 실내건축 및 건축마무리 공사업
  row.getCell(50).value = '실내건축 및 건축마무리 공사업';
  row.getCell(50).style = { ...orangeStyle };

  row.commit();

  console.log('Saving Excel...');
  await wb.xlsx.writeFile(excelPath);
  console.log('Excel saved successfully.');
}

update().catch(console.error);
