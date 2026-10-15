const https = require('https');

function fetchBizno(bizNo) {
  const cleanBizNo = bizNo.replace(/[^0-9]/g, '');
  const url = `https://bizno.net/article/${cleanBizNo}`;
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, html: data });
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
  });
}

function parseBiznoHTML(html) {
  if (!html) return null;

  // Extract description meta tag
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                    html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  const desc = descMatch ? descMatch[1] : '';

  // Extract keywords meta tag
  const kwMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
  const keywords = kwMatch ? kwMatch[1] : '';

  // Parse fields from description or HTML text
  let state = '';
  if (desc.includes('폐업') || html.includes('폐업자') || html.includes('폐업')) state = '폐업';
  else if (desc.includes('계속사업자') || html.includes('계속사업자')) state = '계속사업자';

  // Corp Reg No (법인등록번호)
  const corpNoMatch = desc.match(/법인등록번호\s*:\s*([0-9]{6}-[0-9]{7}|[0-9]{13})/) ||
                      html.match(/([0-9]{6}-[0-9]{7})/);
  const corpNo = corpNoMatch ? corpNoMatch[1] : '';

  // Zip code from HTML if available, or regex 5-digit zip code
  // Let's check table cells in HTML
  // Often in tables: <th>우편번호</th><td>48058</td> or similar
  const zipMatch = html.match(/우편번호[\s\S]*?>([0-9]{5})</i) ||
                   html.match(/postal-code[^>]*>([0-9]{5})</i) ||
                   desc.match(/우편번호\s*:\s*([0-9]{5})/);
  const zipCode = zipMatch ? zipMatch[1] : '';

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

  // NICE BizINFO / 업종명
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

  // Closing Month (결산월) - for corporations, default is 12월 if not specified
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

async function test() {
  const testBizNos = ['8798102382', '7640500472', '3348601207', '7768801268', '6178186557'];
  for (const b of testBizNos) {
    console.log(`\nFetching ${b}...`);
    const res = await fetchBizno(b);
    const parsed = parseBiznoHTML(res.html);
    console.log(JSON.stringify(parsed, null, 2));
  }
}

test();
