const fs = require('fs');
const ExcelJS = require('exceljs');

const STRICT_PORTAL_CS_BLACKLIST = new Set([
  '02-6226-5000', '02-6937-0035', '02-6937-0039',
  '02-3771-1514', '1588-9356', '1588-3333',
  '1577-0000', '02-1577-0000', '02-2008-8888',
  '1588-0114', '114-114', '02-114'
]);

async function runStep1Fill() {
  const targetExcel = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const masterTxt = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';

  console.log(`[Step 1] Loading master text: ${masterTxt}`);
  const txtContent = fs.readFileSync(masterTxt, 'utf8');
  const lines = txtContent.split('\n');
  const txtMap = new Map();

  for (let line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 10) {
      const seq = parseInt(parts[0]);
      const phone = parts[9] ? parts[9].trim() : '';
      if (!isNaN(seq) && phone) {
        txtMap.set(seq, phone);
      }
    }
  }
  console.log(`Master DB phone entries: ${txtMap.size}`);

  console.log(`[Step 1] Loading target workbook: ${targetExcel}`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetExcel);
  const ws = wb.worksheets[0];

  let filledCount = 0;
  let skippedMaskedCount = 0;
  let alreadyFilledCount = 0;
  const filledSamples = [];
  const maskedToUnmask = [];

  for (let r = 668; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const seq = parseInt(row.getCell(1).value);
    const name = row.getCell(2).value;
    const bno = row.getCell(6).value;
    const corpNo = row.getCell(7).value;
    const addr = row.getCell(9).value;
    const cell = row.getCell(10);
    const currPhone = cell.value ? String(cell.value).trim() : '';

    if (currPhone !== '') {
      alreadyFilledCount++;
      continue;
    }

    if (txtMap.has(seq)) {
      const phone = txtMap.get(seq);
      if (STRICT_PORTAL_CS_BLACKLIST.has(phone)) {
        continue;
      }

      if (phone.includes('*')) {
        skippedMaskedCount++;
        maskedToUnmask.push({
          row: r,
          seq,
          name,
          bno,
          corpNo,
          addr,
          maskedPhone: phone
        });
        continue;
      }

      // Fill verified unmasked phone with red font
      cell.value = phone;
      cell.font = Object.assign({}, cell.font || {}, {
        color: { argb: 'FFFF0000' }
      });

      filledCount++;
      if (filledSamples.length < 15) {
        filledSamples.push({ row: r, seq, name, phone });
      }
    }
  }

  console.log(`\n=== Step 1 실행 결과 집계 ===`);
  console.log(`기존 기입 유지 (Seq 667~3978): ${alreadyFilledCount}건`);
  console.log(`신규 채번 완료 (적색 FFFF0000 적용): ${filledCount}건`);
  console.log(`마스킹 보유로 2단계(머니핀 언마스킹)로 이관: ${skippedMaskedCount}건`);

  // Save masked list for Step 2
  fs.writeFileSync('masked_companies_to_unmask.json', JSON.stringify(maskedToUnmask, null, 2), 'utf8');
  console.log(`마스킹 168건 대상 'masked_companies_to_unmask.json' 저장 완료.`);

  // Write Excel file
  try {
    await wb.xlsx.writeFile(targetExcel);
    console.log(`\n[성공] 엑셀 파일 저장 완료: ${targetExcel}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_1차반영.xlsx';
      await wb.xlsx.writeFile(fallbackPath);
      console.log(`[알림] 엑셀이 열려 있어 임시 사본으로 저장되었습니다: ${fallbackPath}`);
    } else {
      throw err;
    }
  }

  console.log(`\n샘플 채번 내역 (15건):`, JSON.stringify(filledSamples, null, 2));
}

runStep1Fill().catch(err => {
  console.error('Error executing Step 1 fill:', err);
  process.exit(1);
});
