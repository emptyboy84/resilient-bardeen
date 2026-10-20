const fs = require('fs');
const ExcelJS = require('exceljs');

async function fixRow545() {
  const userPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const txtPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  const masterXlsx = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  const jsonPath = 'found_from_row498.json';

  console.log('1. Updating found_from_row498.json...');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (json['7368101621']) {
    delete json['7368101621'];
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf8');
    console.log('Removed 7368101621 from json.');
  }

  console.log('2. Updating user excel...');
  const wbUser = new ExcelJS.Workbook();
  await wbUser.xlsx.readFile(userPath);
  const wsUser = wbUser.worksheets[0];
  const row546 = wsUser.getRow(546);
  console.log('Before fix Row 546:', row546.getCell(2).value, '| Phone:', row546.getCell(10).value);
  row546.getCell(10).value = null;
  row546.getCell(10).font = undefined;
  console.log('After fix Row 546:', row546.getCell(2).value, '| Phone:', row546.getCell(10).value);

  try {
    await wbUser.xlsx.writeFile(userPath);
    console.log(`Saved user excel to ${userPath}`);
  } catch(e) {
    console.log('Error writing user excel:', e.message);
  }

  try {
    await wbUser.xlsx.writeFile(masterXlsx);
    console.log(`Saved master excel to ${masterXlsx}`);
  } catch(e) {}

  console.log('3. Updating master TXT...');
  const txtContent = fs.readFileSync(txtPath, 'utf8');
  const lines = txtContent.split('\n');
  const updatedLines = lines.map(line => {
    if (line.startsWith('545\t') || line.includes('736-81-01621')) {
      const parts = line.split('\t');
      parts[9] = ''; // clear phone column
      return parts.join('\t');
    }
    return line;
  });
  fs.writeFileSync(txtPath, updatedLines.join('\n'), 'utf8');
  console.log('Updated master TXT successfully.');
}

fixRow545().catch(e => console.error('Error:', e));
