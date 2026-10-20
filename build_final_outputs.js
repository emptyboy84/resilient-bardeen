const fs = require('fs');
const ExcelJS = require('exceljs');

async function buildFinalOutputs() {
  // 1. Read input_raw_full.txt
  const text = fs.readFileSync('input_raw_full.txt', 'utf8');
  const lines = text.split(/\r?\n/);
  
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('순번') && lines[i].includes('기업명')) {
      headerIndex = i;
      break;
    }
  }

  const header = lines[headerIndex].split('\t');
  console.log('Header length:', header.length);

  // 2. Load step1_results
  const step1 = JSON.parse(fs.readFileSync('step1_results.json', 'utf8'));

  // Add 799 manually
  step1['799'] = {
    seq: '799',
    name: '아이티어스',
    ceo: '박진일',
    phone: '070-4616-7111',
    source: '공식114/웹사이트(ituskorea.com)'
  };

  const outputRows = [header];
  let originalWithPhone = 0;
  let newlyFoundPhone = 0;
  let stillMissing = 0;

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('<') || line.startsWith('NOTE:')) continue;
    let cols = line.split('\t');
    const seq = cols[0].trim();
    if (!/^\d+$/.test(seq)) continue;

    // Ensure 17 columns
    while (cols.length < 17) {
      cols.push('');
    }
    cols = cols.slice(0, 17);

    let phone = (cols[9] || '').trim();

    if (phone) {
      originalWithPhone++;
    } else {
      // Check if we found it
      if (step1[seq] && step1[seq].phone) {
        cols[9] = step1[seq].phone;
        newlyFoundPhone++;
      } else {
        stillMissing++;
      }
    }

    outputRows.push(cols);
  }

  console.log('Output data rows:', outputRows.length - 1);
  console.log('Original rows with phone:', originalWithPhone);
  console.log('Newly found phone numbers:', newlyFoundPhone);
  console.log('Still missing:', stillMissing);
  console.log('Total with phone now:', originalWithPhone + newlyFoundPhone, `(${((originalWithPhone + newlyFoundPhone)/(outputRows.length - 1)*100).toFixed(1)}%)`);

  // Write TSV
  const tsvContent = outputRows.map(r => r.join('\t')).join('\n');
  fs.writeFileSync('busan_companies_phone_verified.tsv', tsvContent, 'utf8');
  console.log('Saved busan_companies_phone_verified.tsv');

  // Write Excel
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('부산기업_전화번호검증');

  outputRows.forEach((row, idx) => {
    const r = ws.addRow(row);
    if (idx === 0) {
      r.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      r.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E79' }
      };
      r.alignment = { vertical: 'middle', horizontal: 'center' };
    } else {
      // Highlight newly found phone numbers in column J (index 10)
      const seq = row[0];
      if (step1[seq] && step1[seq].phone) {
        const cell = r.getCell(10);
        cell.font = { bold: true, color: { argb: 'FF006100' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC6EFCE' }
        };
      }
    }
  });

  // Auto-fit column widths
  ws.columns.forEach((col, i) => {
    col.width = [6, 25, 12, 10, 18, 15, 18, 25, 45, 16, 12, 10, 10, 10, 10, 10, 10][i] || 15;
  });

  await wb.xlsx.writeFile('busan_companies_phone_verified.xlsx');
  console.log('Saved busan_companies_phone_verified.xlsx');
}

buildFinalOutputs();
