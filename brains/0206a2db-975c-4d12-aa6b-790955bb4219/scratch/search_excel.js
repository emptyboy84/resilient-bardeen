const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\node_modules\\exceljs');

async function searchFile(filePath) {
  console.log('Searching in:', filePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.eachSheet((worksheet, sheetId) => {
    worksheet.eachRow((row, rowNumber) => {
      const values = row.values;
      const str = JSON.stringify(values);
      if (str.includes('8985800242') || str.includes('898-58-00242') || str.includes('투투') || str.includes('서현석')) {
        console.log(`MATCH in [${path.basename(filePath)}] sheet "${worksheet.name}" row ${rowNumber}:`, values);
      }
    });
  });
}

async function main() {
  const dataDir = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\data';
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.xlsx'));
  for (const f of files) {
    try {
      await searchFile(path.join(dataDir, f));
    } catch (e) {
      console.error('Error reading', f, e.message);
    }
  }
}

main().catch(console.error);
