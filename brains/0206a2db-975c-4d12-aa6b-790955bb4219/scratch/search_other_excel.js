const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\node_modules\\exceljs');

async function searchOtherExcel() {
  const files = [
    'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\data\\배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx'
  ];

  for (const f of files) {
    console.log('Checking', f);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(f);
    wb.eachSheet((ws) => {
      ws.eachRow((r, rn) => {
        const s = JSON.stringify(r.values);
        if (s.includes('8988802742') || s.includes('케이안전기술원')) {
          console.log(`Match in ${ws.name} row ${rn}:`, r.values);
        }
      });
    });
  }
}

searchOtherExcel().catch(console.error);
