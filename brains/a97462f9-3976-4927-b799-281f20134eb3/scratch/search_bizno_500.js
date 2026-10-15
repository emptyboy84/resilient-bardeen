const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function searchBizno500() {
  const biznoPath = 'C:/Users/lg/Desktop/Today/비즈노_500개_기업정보_16개열_정제완료.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(biznoPath);
  const ws = wb.worksheets[0];

  console.log(`Searching 500 bizno file (Rows: ${ws.rowCount})...`);
  const names = ['토탈소프트뱅크', '센디', '페이타랩', '칸투칸', '쉐어트리츠', '케어닥', '모두싸인', '라온엔터테인먼트', '네오테크놀러지', '우리누리', '씨소프트', '도원이앤아이', '제이더블유하비', '투판즈'];

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const compName = String(row.getCell(2).value || '');
    const bizNo = String(row.getCell(3).value || '');
    const ceo = String(row.getCell(4).value || '');
    const addr = String(row.getCell(6).value || '');
    const phone = String(row.getCell(7).value || '');
    const emp = row.getCell(11).value;

    for (const target of names) {
      if (compName.includes(target)) {
        console.log(`Found in Bizno 500! [${compName}] Biz: ${bizNo} | CEO: ${ceo} | Phone: ${phone} | Addr: ${addr} | Emp: ${emp}`);
      }
    }
  }
}

searchBizno500().catch(console.error);
