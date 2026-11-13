const fs = require('fs');
const https = require('https');
const ExcelJS = require('exceljs');

const FILE_PATH_LATEST = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
const FILE_PATH_BAE = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
const FILE_PATH_SYNC = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx';

async function checkHometax(bnoList) {
  // bnoList: array of strings with or without hyphens
  const cleanList = bnoList.map(b => b.replace(/[^0-9]/g, '')).filter(b => b.length === 10);
  if (cleanList.length === 0) return {};
  
  const postData = JSON.stringify({ b_no: cleanList });
  return new Promise((resolve) => {
    const req = https.request('https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=data-portal-test-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = {};
          if (json.data) {
            for (const item of json.data) {
              result[item.b_no] = item.b_stt; // '계속사업자', '휴업자', '폐업자'
            }
          }
          resolve(result);
        } catch (e) {
          resolve({});
        }
      });
    });
    req.on('error', () => resolve({}));
    req.on('timeout', () => { req.destroy(); resolve({}); });
    req.write(postData);
    req.end();
  });
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE_PATH_LATEST);
  const ws = wb.worksheets[0];
  
  const targets = [];
  ws.eachRow((row, r) => {
    if (r === 1) return;
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const status = row.getCell(4).value;
    const bno = row.getCell(6).value;
    const addr = row.getCell(9).value;
    const tel = row.getCell(10).value;
    
    const telStr = tel ? String(tel).trim() : '';
    const statusStr = status ? String(status).trim() : '';
    
    if (seq >= 701 && seq <= 1000 && !telStr && statusStr !== '폐업') {
      targets.push({
        r,
        seq,
        name: String(name || '').trim(),
        ceo: String(ceo || '').trim(),
        bno: String(bno || '').trim(),
        cleanBno: String(bno || '').replace(/[^0-9]/g, ''),
        addr: String(addr || '').trim(),
        status: statusStr
      });
    }
  });

  console.log(`Checking ${targets.length} companies between Seq 701 and 1000...`);
  
  // 국세청 배치 상태 조회
  const bnos = targets.map(t => t.cleanBno).filter(b => b.length === 10);
  const hometaxResults = {};
  for (let i = 0; i < bnos.length; i += 50) {
    const chunk = bnos.slice(i, i + 50);
    const res = await checkHometax(chunk);
    Object.assign(hometaxResults, res);
  }

  const closed = [];
  const suspended = [];
  const active = [];

  for (const t of targets) {
    const stt = hometaxResults[t.cleanBno];
    if (stt === '폐업자') {
      closed.push(t);
    } else if (stt === '휴업자') {
      suspended.push(t);
    } else {
      active.push(t);
    }
  }

  console.log(`[국세청 검증 결과]`);
  console.log(`- 폐업자: ${closed.length}건`);
  closed.forEach(c => console.log(`  Seq ${c.seq} (Row ${c.r}): ${c.name} (${c.bno}) - 폐업`));
  console.log(`- 휴업자: ${suspended.length}건`);
  suspended.forEach(s => console.log(`  Seq ${s.seq} (Row ${s.r}): ${s.name} (${s.bno}) - 휴업`));
  console.log(`- 계속사업자/미확인: ${active.length}건`);
  
  // JSON 파일로 저장하여 후속 탐색에 활용
  fs.writeFileSync('active_701_1000.json', JSON.stringify(active, null, 2), 'utf8');
  fs.writeFileSync('closed_701_1000.json', JSON.stringify(closed, null, 2), 'utf8');
  fs.writeFileSync('suspended_701_1000.json', JSON.stringify(suspended, null, 2), 'utf8');
}

main();
