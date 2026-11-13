const fs = require('fs');
const https = require('https');
const http = require('http');
const ExcelJS = require('exceljs');

const targetFiles = [
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

function fetchUrl(url, timeoutMs = 4000) {
  return new Promise(resolve => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: timeoutMs
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextUrl = res.headers.location;
        if (!nextUrl.startsWith('http')) {
          nextUrl = new URL(nextUrl, url).toString();
        }
        return resolve(fetchUrl(nextUrl, timeoutMs));
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', () => resolve({ status: 500, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: '' }); });
  });
}

async function queryBizno(cleanBno) {
  if (!cleanBno || cleanBno.length !== 10) return { phone: null, status: null };
  const res = await fetchUrl(`https://bizno.net/article/${cleanBno}`);
  if (res.status !== 200 || !res.body) return { phone: null, status: null };

  let status = null;
  const statusMatch = res.body.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
  if (statusMatch) {
    const text = statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.includes('폐업')) status = '폐업';
    else if (text.includes('휴업')) status = '휴업';
    else if (text.includes('계속')) status = '정상';
  }

  let phone = null;
  const phoneMatch = res.body.match(/<th>\s*전화번호\s*<\/th>\s*<td>\s*([^<]+)\s*<\/td>/i);
  if (phoneMatch) {
    const raw = phoneMatch[1].trim();
    if (raw && raw !== '-' && !raw.includes('없음') && /\d{2,4}[-)]\d{3,4}[-]\d{4}/.test(raw)) {
      phone = raw;
    }
  }

  return { phone, status };
}

async function queryMoneypin(cleanBno) {
  if (!cleanBno || cleanBno.length !== 10) return null;
  try {
    const postData = JSON.stringify({ bizNo: cleanBno });
    return await new Promise(resolve => {
      const req = https.request('https://moneypin.biz/api/biz/lookup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 4000
      }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            if (j && j.data && j.data.phone) {
              const p = String(j.data.phone).trim();
              if (/\d{2,4}[-)]\d{3,4}[-]\d{4}/.test(p)) return resolve(p);
            }
            resolve(null);
          } catch(e) { resolve(null); }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.write(postData);
      req.end();
    });
  } catch(e) { return null; }
}

async function saveBatch(updates) {
  if (updates.length === 0) return;
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) continue;
    try {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(filePath);
      const ws = wb.worksheets[0];
      
      for (const u of updates) {
        const row = ws.getRow(u.row);
        
        // 상태 변경(폐업/휴업)
        if (u.newStatus && u.newStatus !== '정상') {
          const statusCell = row.getCell(4);
          statusCell.value = u.newStatus;
          statusCell.font = { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FFFF0000' } };
          statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        
        // 전화번호 반영
        if (u.phone) {
          const telCell = row.getCell(10);
          const font = telCell.font;
          const isRed = font && font.color && (font.color.argb === 'FFFF0000' || font.color.argb === 'FF0000');
          if (!isRed) {
            telCell.value = u.phone;
            telCell.font = { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FF006100' } };
            telCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
            telCell.alignment = { vertical: 'middle', horizontal: 'center' };
          }
        }
      }
      await wb.xlsx.writeFile(filePath);
      console.log(`[SAVED] ${updates.length} updates applied to ${filePath}`);
    } catch(err) {
      console.error(`Error saving to ${filePath}:`, err.message);
    }
  }
}

async function run() {
  const targets = JSON.parse(fs.readFileSync('remaining_1301_end.json', 'utf8'));
  console.log(`Starting automated scan for all ${targets.length} targets...`);
  
  const foundUpdates = [];
  let checked = 0;
  
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    checked++;
    
    if (!t.cleanBno || t.cleanBno.length !== 10) continue;
    
    // 1. Bizno
    const bz = await queryBizno(t.cleanBno);
    let finalPhone = bz.phone;
    let finalStatus = bz.status;
    
    // 2. Moneypin (전화번호 없는 경우 보완)
    if (!finalPhone) {
      const mpPhone = await queryMoneypin(t.cleanBno);
      if (mpPhone) finalPhone = mpPhone;
    }
    
    if (finalPhone || (finalStatus && finalStatus !== '정상')) {
      const u = {
        row: t.r,
        seq: t.seq,
        name: t.name,
        bno: t.bno,
        phone: finalPhone,
        newStatus: finalStatus,
        source: finalPhone ? (bz.phone ? '비즈노' : '머니핀') : '국세청 홈택스/비즈노'
      };
      foundUpdates.push(u);
      console.log(`[발견] Seq ${t.seq} | ${t.name} | 상태: ${finalStatus || '정상'} | 전화: ${finalPhone || '-'} (${u.source})`);
      
      // 5개 발견될 때마다 중간 세이브
      if (foundUpdates.length % 5 === 0) {
        await saveBatch(foundUpdates);
      }
    }
    
    if (checked % 50 === 0) {
      console.log(`Progress: ${checked}/${targets.length} checked... (Total updates found so far: ${foundUpdates.length})`);
    }
    
    // Rate limit 예방용 미세 딜레이
    await new Promise(r => setTimeout(r, 120));
  }
  
  // 최종 반영
  if (foundUpdates.length > 0) {
    await saveBatch(foundUpdates);
  }
  
  console.log(`Scan finished! Total ${checked} scanned, ${foundUpdates.length} updates found and saved.`);
  fs.writeFileSync('all_end_updates_result.json', JSON.stringify(foundUpdates, null, 2), 'utf8');
}

run();
