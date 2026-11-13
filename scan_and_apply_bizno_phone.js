const fs = require('fs');
const https = require('https');
const ExcelJS = require('exceljs');

const targetFiles = [
  'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
  'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

const targets = JSON.parse(fs.readFileSync('bizno_phone_targets.json', 'utf8'));
console.log(`Loaded ${targets.length} targets to scan.`);

function fetchBizno(bno) {
  return new Promise(resolve => {
    const req = https.get('https://bizno.net/article/' + bno, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 4500
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function parseBizno(html) {
  let status = null;
  const statusMatch = html.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  if (statusMatch) {
    const text = statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.includes('폐업')) status = '폐업';
    else if (text.includes('휴업')) status = '휴업';
    else if (text.includes('계속')) status = '정상';
  }

  let phone = null;
  const phoneMatch = html.match(/<th>\s*전화번호\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  if (phoneMatch) {
    let raw = phoneMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw && raw !== '-' && !raw.includes('없음') && !raw.includes('비공개')) {
      const digits = raw.replace(/[^0-9]/g, '');
      if (digits.length === 10 && digits.startsWith('10')) {
        phone = '0' + digits.slice(0, 2) + '-' + digits.slice(2, 6) + '-' + digits.slice(6);
      } else if (digits.length === 11 && digits.startsWith('010')) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
      } else if (digits.length === 10 && (digits.startsWith('011') || digits.startsWith('016') || digits.startsWith('017') || digits.startsWith('018') || digits.startsWith('019'))) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length === 9 && digits.startsWith('02')) {
        phone = '02-' + digits.slice(2, 5) + '-' + digits.slice(5);
      } else if (digits.length === 10 && digits.startsWith('02')) {
        phone = '02-' + digits.slice(2, 6) + '-' + digits.slice(6);
      } else if (digits.length === 10 && (digits.startsWith('051') || digits.startsWith('070') || digits.startsWith('031') || digits.startsWith('052') || digits.startsWith('055'))) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length === 11 && digits.startsWith('070')) {
        phone = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
      } else if (raw.includes('-') && /\d{2,4}-\d{3,4}-\d{4}/.test(raw)) {
        phone = raw;
      }
    }
  }

  return { phone, status };
}

async function applyBatchToExcel(batch) {
  if (batch.length === 0) return;
  console.log(`Applying batch of ${batch.length} updates to Excel files...`);

  for (const filePath of targetFiles) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    for (const item of batch) {
      const row = ws.getRow(item.rowNum);
      
      // 전화번호 업데이트 (빨간색 볼드)
      if (item.phone) {
        const cell = row.getCell(10);
        cell.value = item.phone;
        cell.style = Object.assign({}, cell.style, {
          font: {
            name: '맑은 고딕',
            size: 10,
            bold: true,
            color: { argb: 'FFFF0000' }
          }
        });
      }

      // 상태 업데이트 (폐업/휴업 시 빨간색 볼드)
      if (item.status && (item.status === '폐업' || item.status === '휴업')) {
        const statusCell = row.getCell(4);
        statusCell.value = item.status;
        statusCell.style = Object.assign({}, statusCell.style, {
          font: {
            name: '맑은 고딕',
            size: 10,
            bold: true,
            color: { argb: 'FFFF0000' }
          }
        });
      }
    }

    await wb.xlsx.writeFile(filePath);
    console.log(`Saved updates to ${filePath.split('/').pop()}`);
  }
}

async function main() {
  const CONCURRENCY = 6;
  const foundUpdates = [];
  let pendingBatch = [];
  let processedCount = 0;

  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const slice = targets.slice(i, i + CONCURRENCY);
    const promises = slice.map(async (t) => {
      const html = await fetchBizno(t.bno);
      const res = parseBizno(html);
      return { ...t, phone: res.phone, status: res.status };
    });

    const results = await Promise.all(promises);
    processedCount += results.length;

    for (const r of results) {
      const hasPhone = Boolean(r.phone);
      const isClosedOrSuspended = (r.status === '폐업' || r.status === '휴업') && r.status !== r.currentStatus;

      if (hasPhone || isClosedOrSuspended) {
        console.log(`[FOUND] Row ${r.rowNum} (Seq ${r.seq}) ${r.name} -> Phone: ${r.phone || '(no change)'}, Status: ${r.status || r.currentStatus}`);
        foundUpdates.push(r);
        pendingBatch.push(r);
      }
    }

    if (processedCount % 60 === 0 || processedCount === targets.length) {
      console.log(`Progress: ${processedCount}/${targets.length} checked (${foundUpdates.length} found so far)`);
    }

    // 20건 이상 모이면 엑셀에 동기화
    if (pendingBatch.length >= 20) {
      await applyBatchToExcel(pendingBatch);
      pendingBatch = [];
      fs.writeFileSync('bizno_found_updates.json', JSON.stringify(foundUpdates, null, 2), 'utf8');
    }

    // 요청 간 200ms 지연
    await new Promise(r => setTimeout(r, 200));
  }

  // 잔여 배치 저장
  if (pendingBatch.length > 0) {
    await applyBatchToExcel(pendingBatch);
    pendingBatch = [];
  }

  fs.writeFileSync('bizno_found_updates.json', JSON.stringify(foundUpdates, null, 2), 'utf8');
  console.log(`=== SCAN COMPLETED ===`);
  console.log(`Total checked: ${processedCount}`);
  console.log(`Total found updates: ${foundUpdates.length}`);
}

main().catch(console.error);
