const fs = require('fs');
const path = require('path');

const inputFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const cacheFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/bizno_200_cache.json';

let cache = {};
if (fs.existsSync(cacheFile)) {
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  } catch (e) {
    cache = {};
  }
}

async function fetchBizno(bizno) {
  if (cache[bizno]) return cache[bizno];

  try {
    const res = await fetch(`https://bizno.net/article/${bizno}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      cache[bizno] = { bizno, status: '', error: res.status };
      return cache[bizno];
    }
    const html = await res.text();
    
    const data = { bizno };
    
    // Status
    const statusMatch = html.match(/사업자\s*현재\s*상태[\s\S]*?(계속사업자|폐업자|휴업자)/);
    if (statusMatch) {
      if (statusMatch[1] === '폐업자') data.status = '폐업';
      else if (statusMatch[1] === '휴업자') data.status = '휴업';
      else data.status = ''; // 계속사업자 -> normal (blank in 17-col)
    } else {
      data.status = '';
    }

    // Zip code
    const zipMatch = html.match(/우편번호[\s\S]*?(\d{5})/);
    if (zipMatch) data.zip = zipMatch[1];

    // Address
    const addrMatch = html.match(/회사주소\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i) ||
                      html.match(/회사주소[\s\S]*?([가-힣\s\d\-]+)/);
    if (addrMatch) {
      data.addr = addrMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Phone
    const phoneMatch = html.match(/전화번호\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (phoneMatch) {
      const p = phoneMatch[1].replace(/<[^>]+>/g, '').trim();
      if (p && p !== '-') data.phone = p;
    }

    // Fax
    const faxMatch = html.match(/팩스번호\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (faxMatch) {
      const f = faxMatch[1].replace(/<[^>]+>/g, '').trim();
      if (f && f !== '-') data.fax = f;
    }

    // Email
    const emailMatch = html.match(/회사이메일\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (emailMatch) {
      const em = emailMatch[1].replace(/<[^>]+>/g, '').trim();
      if (em && em !== '-') data.email = em;
    }

    // Employees
    const empMatch = html.match(/종업원수\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (empMatch) {
      const emp = empMatch[1].replace(/<[^>]+>/g, '').replace(/[^0-9]/g, '').trim();
      if (emp) data.employees = emp;
    }

    // Industry classifications
    const dae = html.match(/대분류\s*:\s*([^<\n\r]+?)(?=\s*중분류|<|$)/);
    const jung = html.match(/중분류\s*:\s*([^<\n\r]+?)(?=\s*소분류|<|$)/);
    const so = html.match(/소분류\s*:\s*([^<\n\r]+?)(?=\s*세분류|<|$)/);
    if (dae) data.dae = dae[1].trim();
    if (jung) data.jung = jung[1].trim();
    if (so) data.so = so[1].trim();

    // Industry (종목)
    const indMatch = html.match(/종\s*목\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (indMatch) {
      const ind = indMatch[1].replace(/<[^>]+>/g, '').trim();
      if (ind && ind !== '-') data.industry = ind;
    }

    cache[bizno] = data;
    return data;
  } catch (err) {
    cache[bizno] = { bizno, status: '', error: err.message };
    return cache[bizno];
  }
}

async function run() {
  const lines = fs.readFileSync(inputFile, 'utf-8').split(/\r?\n/).filter(l => l.trim().length > 0);
  console.log(`Processing ${lines.length} lines...`);
  
  const biznos = lines.map(l => l.split('\t')[3]?.trim()).filter(b => b && b.length === 10);
  console.log(`Extracted ${biznos.length} biznos.`);

  const batchSize = 5;
  for (let i = 0; i < biznos.length; i += batchSize) {
    const chunk = biznos.slice(i, i + batchSize);
    await Promise.all(chunk.map(b => fetchBizno(b)));
    if ((i + batchSize) % 25 === 0 || i + batchSize >= biznos.length) {
      console.log(`Fetched ${Math.min(i + batchSize, biznos.length)} / ${biznos.length}...`);
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
    }
    // slight delay
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
  console.log('Finished fetching all 200 biznos. Cached to:', cacheFile);
}

run().catch(console.error);
