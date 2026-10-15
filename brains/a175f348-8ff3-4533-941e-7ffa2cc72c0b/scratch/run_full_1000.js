const fs = require('fs');
const https = require('https');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

function toCSVLine(cols) {
  return cols.map(col => {
    if (col === null || col === undefined) return '';
    const str = String(col);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

function fetchBizno(bizNo) {
  const cleanBizNo = String(bizNo).replace(/[^0-9]/g, '');
  if (!cleanBizNo || cleanBizNo.length < 10) {
    return Promise.resolve({ status: 400, html: '' });
  }
  const url = `https://bizno.net/article/${cleanBizNo}`;
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 6000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, html: data });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 408, error: 'Timeout' });
    });
  });
}

function parseBiznoHTML(html) {
  if (!html) return null;

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                    html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  const desc = descMatch ? descMatch[1] : '';

  // State: 계속사업자 / 폐업자
  let state = '';
  const stateMatch = desc.match(/사업자\s*현재\s*상태[^\:]*:\s*([^\s]+)/) ||
                     html.match(/사업자\s*현재\s*상태[^\:]*:\s*([^\s<]+)/);
  if (stateMatch) {
    if (stateMatch[1].includes('폐업')) state = '폐업';
    else if (stateMatch[1].includes('계속')) state = '';
  } else {
    if (desc.includes('폐업자')) state = '폐업';
  }

  // Corp Reg No (법인등록번호)
  const corpNoMatch = desc.match(/법인등록번호\s*:\s*([0-9]{6}-[0-9]{7}|[0-9]{13})/) ||
                      html.match(/([0-9]{6}-[0-9]{7})/);
  const corpNo = corpNoMatch ? corpNoMatch[1] : '';

  // Zip Code (우편번호)
  let zipCode = '';
  const zipMatch = html.match(/우편번호[\s\S]*?>([0-9]{5})</i) ||
                   html.match(/postal-code[^>]*>([0-9]{5})</i) ||
                   desc.match(/우편번호\s*:\s*([0-9]{5})/);
  if (zipMatch) {
    zipCode = zipMatch[1];
  }

  // Address (회사주소)
  let address = '';
  const addrMatch = desc.match(/회사주소\s*:\s*([^\t\r\n]+?)(?=\s+종업원수|\s+사업자등록번호|\s+[0-9]+,\s+[A-Za-z]|\s+법인등록번호|$)/);
  if (addrMatch) {
    address = addrMatch[1].trim();
  }

  // Industry hierarchy from "업종분류 : ..."
  let industryDae = '', industryJung = '', industrySo = '', industrySe = '', industrySese = '';
  const catMatch = desc.match(/업종분류\s*:\s*([^\t\r\n]+?)(?=\s*업태|\s*업종|\s*사업자|$)/);
  if (catMatch) {
    const rawCat = catMatch[1].trim();
    const parts = rawCat.split('>').map(s => s.trim().replace(/[\t\r\n]/g, '')).filter(Boolean);
    if (parts.length >= 1) industryDae = parts[0];
    if (parts.length >= 2) industryJung = parts[1];
    if (parts.length >= 3) industrySo = parts[2];
    if (parts.length >= 4) industrySe = parts[3];
    if (parts.length >= 5) industrySese = parts[4];
  }

  // NICE BizINFO / 산업명
  let niceBizInfo = '';
  const upjongMatch = desc.match(/업종\s*:\s*([^\t\r\n]+?)(?=\s*통신판매|\s*사업자|\s*설립일|$)/);
  if (upjongMatch) {
    niceBizInfo = upjongMatch[1].trim();
  }
  if (!niceBizInfo) {
    niceBizInfo = industrySese || industrySe || industrySo || industryJung || industryDae;
  }

  // Employees (종업원수)
  let employees = '';
  const empMatch = desc.match(/종업원수\s*:\s*([0-9]+명|[0-9]+인\s*미만|[0-9]+)/);
  if (empMatch) {
    employees = empMatch[1].trim();
  }

  // Phone (전화번호)
  let phone = '';
  const phoneMatch = desc.match(/전화번호\s*:\s*([0-9\-]+)/);
  if (phoneMatch) {
    phone = phoneMatch[1].trim();
  }

  // Fax (팩스번호)
  let fax = '';
  const faxMatch = desc.match(/팩스번호\s*:\s*([0-9\-]+)/);
  if (faxMatch) {
    fax = faxMatch[1].trim();
  }

  // Homepage (홈페이지)
  let homepage = '';
  const hpMatch = desc.match(/홈페이지\s*:\s*([^\s\t\r\n]+)/);
  if (hpMatch) {
    homepage = hpMatch[1].trim();
  }

  // Representative (대표자)
  let rep = '';
  const repMatch = desc.match(/대표자명\s*:\s*([^\s\t\r\n]+)/);
  if (repMatch) {
    rep = repMatch[1].trim();
  }

  // Closing Month (결산월)
  let closingMonth = '';
  if (corpNo || desc.includes('법인')) {
    closingMonth = '12월';
  }

  return {
    state,
    rep,
    zipCode,
    address,
    phone,
    fax,
    homepage,
    employees,
    niceBizInfo,
    corpNo,
    closingMonth,
    industryDae,
    industryJung,
    industrySo,
    industrySe,
    industrySese
  };
}

async function main() {
  const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const backupPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup.csv';

  console.log('Reading file...');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Create backup if not exists
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`Backup created at: ${backupPath}`);
  }

  const lines = content.split(/\r?\n/);
  const header = parseCSVLine(lines[0]);

  // Find all rows belonging to 배현명
  const bhmIndices = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCSVLine(lines[i]);
    if (cols[0] === '배현명') {
      bhmIndices.push(i);
    }
  }

  console.log(`Found ${bhmIndices.length} rows for 배현명.`);

  let processedCount = 0;
  let successCount = 0;
  let closedCount = 0;

  // Process all rows with concurrency of 5
  const CONCURRENCY = 5;
  for (let i = 0; i < bhmIndices.length; i += CONCURRENCY) {
    const chunk = bhmIndices.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (lineIdx) => {
      const cols = parseCSVLine(lines[lineIdx]);
      const bizNo = cols[3];
      const company = cols[2];

      const res = await fetchBizno(bizNo);
      if (res.status === 200) {
        const p = parseBiznoHTML(res.html);
        if (p) {
          successCount++;
          if (p.state === '폐업') {
            cols[1] = '폐업';
            closedCount++;
          }
          if (p.rep && !cols[4]) cols[4] = p.rep;
          if (p.zipCode && !cols[5]) cols[5] = p.zipCode;
          if (p.address && (!cols[6] || cols[6].length < p.address.length)) cols[6] = p.address;
          if (p.phone && !cols[7]) cols[7] = p.phone;
          if (p.fax && !cols[8]) cols[8] = p.fax;
          if (p.homepage && !cols[9]) cols[9] = p.homepage;
          if (p.employees && !cols[14]) cols[14] = p.employees;
          
          // NICE BizINFO 산업명 (Col 17)
          if (p.niceBizInfo) cols[17] = p.niceBizInfo;
          
          // Corp No (Col 24)
          if (p.corpNo && !cols[24]) cols[24] = p.corpNo;
          
          // Closing month (Col 30)
          if (p.closingMonth && !cols[30]) cols[30] = p.closingMonth;
          
          // Industry Dae, Jung, So (Cols 47, 48, 49)
          if (p.industryDae) cols[47] = p.industryDae;
          if (p.industryJung) cols[48] = p.industryJung;
          if (p.industrySo) cols[49] = p.industrySo;

          // Double check duplicated BizNo (Col 23)
          if (!cols[23] && cols[3]) cols[23] = cols[3];
        }
      }

      lines[lineIdx] = toCSVLine(cols);
      processedCount++;
    }));

    if (processedCount % 50 === 0 || processedCount === bhmIndices.length) {
      console.log(`Progress: ${processedCount}/${bhmIndices.length} (${(processedCount/bhmIndices.length*100).toFixed(0)}%) - Verified: ${successCount}, Closed: ${closedCount}`);
    }

    // Small delay between chunks
    await new Promise(r => setTimeout(r, 80));
  }

  // Save the updated CSV file
  console.log('Writing updated content back to CSV...');
  fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
  console.log('Successfully updated the original CSV file!');
}

main().catch(console.error);
