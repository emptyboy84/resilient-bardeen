const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function searchIn192Files() {
  const files = [
    'C:/Users/lg/Desktop/Today/사업자번호_찾은_192개.xlsx',
    'C:/Users/lg/Desktop/Today/사업자번호_찾은_192개_매출액포함.xlsx',
    'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_기업정보.xlsx',
    'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx'
  ];

  for (const f of files) {
    try {
      const wb = new xlsx.Workbook();
      await wb.xlsx.readFile(f);
      console.log(`Checking ${f}...`);
      wb.worksheets.forEach(ws => {
        ws.eachRow((r, rNum) => {
          const rowStr = r.values.join(' ');
          if (rowStr.includes('동화사') || rowStr.includes('464-0761') || rowStr.includes('중앙대로226번길 7-6')) {
            console.log(`Found in [${ws.name} Row ${rNum}]:`, r.values);
          }
        });
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

searchIn192Files().catch(console.error);
