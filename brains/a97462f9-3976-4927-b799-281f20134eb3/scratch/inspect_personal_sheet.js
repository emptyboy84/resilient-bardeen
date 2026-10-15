const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectPersonalSheet() {
  const wb = new xlsx.Workbook();
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  await wb.xlsx.readFile(filePath);

  const ws = wb.getWorksheet('개인 리스트');
  console.log('=== AUDITING [개인 리스트] ===');
  console.log('Total rows:', ws.rowCount);
  const header = ws.getRow(1).values;
  console.log('Header:', header);

  let emptyNames = 0;
  let invalidClosedDate = 0;
  const categories = {};
  const contactResults = {};

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r).values;
    // row is 1-indexed array: [empty, seq, name, phone, cat, contact, closedDate, note]
    const seq = row[1];
    const name = row[2];
    const phone = row[3];
    const cat = row[4];
    const contact = row[5];
    const closedDate = row[6];
    const note = row[7];

    if (!name) emptyNames++;
    if (cat) categories[cat] = (categories[cat] || 0) + 1;
    if (contact) contactResults[contact] = (contactResults[contact] || 0) + 1;
    if (closedDate) {
      const cdStr = String(closedDate);
      if (cdStr.includes('휴업')) invalidClosedDate++;
    }
  }

  console.log('Empty names:', emptyNames);
  console.log('Invalid closed dates:', invalidClosedDate);
  console.log('Categories:', categories);
  console.log('Contact Results:', contactResults);
}

inspectPersonalSheet();
