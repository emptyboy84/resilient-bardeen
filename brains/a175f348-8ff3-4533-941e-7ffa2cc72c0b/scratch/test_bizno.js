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

  // Extract keywords
  const kwMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
  const keywords = kwMatch ? kwMatch[1] : '';

  // Parse fields from description
  const getField = (prefix, endPattern) => {
    const idx = desc.indexOf(prefix);
    if (idx === -1) return '';
    const start = idx + prefix.length;
    const rest = desc.substring(start).trim();
    if (!endPattern) return rest;
    const endMatch = rest.match(endPattern);
    return endMatch ? rest.substring(0, endMatch.index).trim() : rest;
  };

  // State: 계속사업자 / 폐업자
  let state = '';
  if (desc.includes('계속사업자') || html.includes('계속사업자')) state = '계속사업자';
  else if (desc.includes('폐업') || html.includes('폐업')) state = '폐업';

  // Extract Corp Reg No (법인번호)
  const corpNoMatch = desc.match(/법인등록번호\s*:\s*([0-9]{6}-[0-9]{7}|[0-9]{13})/);
  const corpNo = corpNoMatch ? corpNoMatch[1] : '';

  // Extract Industry Category Hierarchy
  // e.g. 업종분류 : 정보통신업 > 영상ㆍ오디오 기록물 제작 및 배급업 > 영화, 비디오물, 방송 프로그램 제작 및 배급업 > 영화, 비디오물 및 방송 프로그램 제작업 > 애니메이션 영화 및 비디오물 제작업
  let industryCat = '';
  let industryDae = '', industryJung = '', industrySo = '', niceBizInfo = '';
  const catMatch = desc.match(/업종분류\s*:\s*([^업\t\r\n]+)/);
  if (catMatch) {
    const parts = catMatch[1].split('>').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 1) industryDae = parts[0];
    if (parts.length >= 2) industryJung = parts[1];
    if (parts.length >= 3) industrySo = parts[2];
    if (parts.length >= 5) niceBizInfo = parts[4];
    else if (parts.length >= 4) niceBizInfo = parts[3];
    else if (parts.length >= 1) niceBizInfo = parts[parts.length - 1];
  }

  // Extract 업종 / 업태
  const industryMatch = desc.match(/업종\s*:\s*([^사\t\r\n]+)/);
  const upjong = industryMatch ? industryMatch[1].trim() : '';
  if (!niceBizInfo && upjong) niceBizInfo = upjong;

  // Extract Address
  const addrMatch = desc.match(/회사주소\s*:\s*([^\t\r\n]+?)(?=\s+종업원수|\s+사업자등록번호|\s+[0-9]+,\s+[A-Za-z])/);
  const address = addrMatch ? addrMatch[1].trim() : '';

  // Extract Employees
  const empMatch = desc.match(/종업원수\s*:\s*([0-9]+명|[0-9]+인\s*미만|[0-9]+)/);
  const employees = empMatch ? empMatch[1].trim() : '';

  // Extract Phone
  const phoneMatch = desc.match(/전화번호\s*:\s*([0-9\-]+)/);
  const phone = phoneMatch ? phoneMatch[1].trim() : '';

  // Extract Fax
  const faxMatch = desc.match(/팩스번호\s*:\s*([0-9\-]+)/);
  const fax = faxMatch ? faxMatch[1].trim() : '';

  // Extract Homepage
  const hpMatch = desc.match(/홈페이지\s*:\s*([^\s\t\r\n]+)/);
  const homepage = hpMatch ? hpMatch[1].trim() : '';

  // Extract Representative
  const repMatch = desc.match(/대표자명\s*:\s*([^\s\t\r\n]+)/);
  const rep = repMatch ? repMatch[1].trim() : '';

  return {
    state,
    corpNo,
    industryDae,
    industryJung,
    industrySo,
    niceBizInfo,
    address,
    employees,
    phone,
    fax,
    homepage,
    rep,
    desc
  };
}

async function test() {
  const testBizNos = ['8798102382', '7640500472', '3348601207', '7768801268', '6178186557'];
  for (const b of testBizNos) {
    console.log(`\nFetching ${b}...`);
    const res = await fetchBizno(b);
    console.log(`Status: ${res.status}`);
    const parsed = parseBiznoHTML(res.html);
    console.log(JSON.stringify(parsed, null, 2));
  }
}

test();
