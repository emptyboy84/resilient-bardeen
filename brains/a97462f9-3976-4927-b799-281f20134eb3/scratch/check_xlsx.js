const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');
const path = require('path');

const targetFiles = [
  '사업자번호_찾은_192개.xlsx',
  '사업자번호_찾은_192개_매출액포함.xlsx',
  '비즈노_500개_기업정보_16개열_정제완료.xlsx',
  '배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx',
  '배현명_실사DB_문제항목_구체적상세리포트.xlsx'
];

async function check() {
  for (const f of targetFiles) {
    try {
      const fullPath = path.join('C:\\Users\\lg\\Desktop\\Today', f);
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(fullPath);
      wb.eachSheet((sheet) => {
        sheet.eachRow((row, rowNumber) => {
          const str = JSON.stringify(row.values);
          if (str && (str.includes('동화사') || str.includes('464-0761'))) {
            console.log(`[FOUND in ${f} | ${sheet.name} | Row ${rowNumber}]`);
            console.log(str);
          }
        });
      });
    } catch (e) {
      console.error('Error reading', f, e.message);
    }
  }
  console.log('Done scanning target xlsx files.');
}

check();
