const fs = require('fs');
const ExcelJS = require('c:/Users/lg/resilient-bardeen/node_modules/exceljs');

async function fullEnrichAndInput() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const backupSrc = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup_11847_12346.xlsx';
  
  console.log('Reading factchecked TSV...');
  const factLines = fs.readFileSync('c:/Users/lg/resilient-bardeen/all_500_factchecked.tsv', 'utf-8').split('\n').filter(l => l.trim().length > 0);
  console.log('Total factchecked lines:', factLines.length);
  
  console.log('Loading workbook from desktop...');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('기업 정보');
  
  const orangeFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFA500' } // #FFA500
  };
  
  let modifiedCellsCount = 0;
  
  function updateCell(cell, newVal, applyOrange = true) {
    if (newVal === undefined || newVal === null || newVal === '') return;
    const oldVal = cell.value;
    // Don't overwrite existing valid value with placeholder like '--' or '-'
    if (typeof newVal === 'string' && (newVal === '--' || newVal === '-')) {
      return;
    }
    
    // Check if changed or newly populated
    const oldStr = oldVal ? (typeof oldVal === 'object' && oldVal.text ? String(oldVal.text) : String(oldVal)).trim() : '';
    const newStr = String(newVal).trim();
    
    if (oldStr !== newStr) {
      cell.value = newVal;
      if (applyOrange) {
        cell.fill = orangeFill;
      }
      modifiedCellsCount++;
    }
  }
  
  for (let i = 0; i < factLines.length; i++) {
    const rowNum = 11847 + i;
    const row = sheet.getRow(rowNum);
    const p = factLines[i].split('\t');
    
    // Col 1: 작성자
    if (!row.getCell(1).value) row.getCell(1).value = '배현명';
    
    // Col 2: 비고
    if (p[1] && p[1].trim()) {
      updateCell(row.getCell(2), p[1].trim(), true);
    }
    
    // Col 3: 회사명
    if (p[2] && p[2].trim()) {
      updateCell(row.getCell(3), p[2].trim(), false);
    }
    
    // Col 4: 사업자번호 with Hyperlink
    const bizno = (p[3] || '').trim();
    if (bizno) {
      const cell4 = row.getCell(4);
      const targetHyperlink = 'https://bizno.net/article/' + bizno;
      const curText = cell4.value ? (typeof cell4.value === 'object' && cell4.value.text ? cell4.value.text : String(cell4.value)) : '';
      if (!cell4.value || typeof cell4.value !== 'object' || cell4.value.hyperlink !== targetHyperlink) {
        cell4.value = {
          text: bizno,
          hyperlink: targetHyperlink
        };
        cell4.font = { color: { argb: 'FF0000FF' }, underline: true };
        cell4.fill = orangeFill;
        modifiedCellsCount++;
      }
    }
    
    // Col 5: 대표자
    if (p[4] && p[4].trim()) {
      updateCell(row.getCell(5), p[4].trim(), false);
    }
    
    // Col 6: 우편번호
    if (p[5] && p[5].trim()) {
      updateCell(row.getCell(6), p[5].trim(), true);
    }
    
    // Col 7: 주소
    if (p[6] && p[6].trim()) {
      updateCell(row.getCell(7), p[6].trim(), true);
    }
    
    // Col 8: 전화번호
    if (p[7] && p[7].trim() && p[7].trim() !== '--' && p[7].trim() !== '-') {
      updateCell(row.getCell(8), p[7].trim(), true);
    }
    
    // Col 9: 팩스번호
    if (p[8] && p[8].trim() && p[8].trim() !== '--' && p[8].trim() !== '-') {
      updateCell(row.getCell(9), p[8].trim(), true);
    }
    
    // Col 10: 홈페이지
    if (p[9] && p[9].trim() && (p[9].startsWith('http://') || p[9].startsWith('https://'))) {
      updateCell(row.getCell(10), p[9].trim(), true);
    }
    
    // Col 11: 이메일
    if (p[10] && p[10].trim() && p[10].includes('@')) {
      updateCell(row.getCell(11), p[10].trim(), true);
    }
    
    // Col 15: 종업원수
    if (p[11] && p[11].trim() !== '') {
      const empNum = !isNaN(p[11].trim()) ? Number(p[11].trim()) : p[11].trim();
      updateCell(row.getCell(15), empNum, true);
    }
    
    // Col 18: NICE 표준산업명
    if (p[12] && p[12].trim()) {
      updateCell(row.getCell(18), p[12].trim(), true);
    }
    
    // Col 25: 법인등록번호
    if (p[13] && p[13].trim()) {
      let corpClean = p[13].trim();
      if (/^[0-9]{13}$/.test(corpClean)) {
        corpClean = corpClean.substring(0, 6) + '-' + corpClean.substring(6);
      }
      updateCell(row.getCell(25), corpClean, true);
    }
    
    // Col 31: 결산월
    if (p[14] && p[14].trim()) {
      updateCell(row.getCell(31), p[14].trim(), true);
    }
    
    // Col 48: 업종_대
    if (p[15] && p[15].trim()) {
      updateCell(row.getCell(48), p[15].trim(), true);
    }
    
    // Col 49: 업종_중
    if (p[16] && p[16].trim()) {
      updateCell(row.getCell(49), p[16].trim(), true);
    }
    
    // Col 50: 업종_소
    if (p[17] && p[17].trim()) {
      updateCell(row.getCell(50), p[17].trim(), true);
    }
    
    row.commit();
  }
  
  console.log('Total modified/enriched cells count:', modifiedCellsCount);
  
  console.log('Writing to temporary file...');
  const tempPath = filePath + '.tmp';
  await workbook.xlsx.writeFile(tempPath);
  
  console.log('Renaming temp to final path...');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.renameSync(tempPath, filePath);
  
  console.log('Successfully saved! Final file size:', fs.statSync(filePath).size, 'bytes');
  
  // Also sync to repo data folder
  const repoCopy = 'c:/Users/lg/resilient-bardeen/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  fs.copyFileSync(filePath, repoCopy);
  console.log('Synced to repo data folder:', repoCopy);
}

fullEnrichAndInput().catch(console.error);
