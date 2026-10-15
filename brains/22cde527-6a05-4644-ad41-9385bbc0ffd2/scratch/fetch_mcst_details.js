const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const matched = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'mcst_matched_publishers.json'), 'utf8'));

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function cleanHtml(s) {
  return s ? s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

async function run() {
  const details = [];

  for (const item of matched) {
    const { comp, mcstResults } = item;
    for (const r of mcstResults) {
      // Filter candidates that match Gu if comp has Gu
      if (comp.gu && !r.addr.includes(comp.gu)) continue;

      const html = await fetchUrl(r.href);
      const text = cleanHtml(html);

      // Extract fields from searchView
      // Typical format: 상호 ... 등록신고번호 ... 지역 ... 자료구분 ... 등록번호 ... 등록일자 ... 등록청 ... 소재지 ... 변경등록 ... 폐업일자 ... 영업구분
      const mRegDate = text.match(/등록일자\s*[:：]?\s*(\d{4}[-.]\d{2}[-.]\d{2})/);
      const mCloseDate = text.match(/폐업일자\s*[:：]?\s*(\d{4}[-.]\d{2}[-.]\d{2})/);
      const mRegNo = text.match(/등록번호\s*[:：]?\s*(\d+)/);
      const mAddr = text.match(/소재지\s*[:：]?\s*([^\s]+(?:\s+[^\s]+){1,5})/);

      console.log(`\nRow ${comp.rowNumber}: [${comp.name}] vs MCST [${r.title}]`);
      console.log(`   Link: ${r.href}`);
      console.log(`   등록번호: ${mRegNo ? mRegNo[1] : ''}`);
      console.log(`   등록일자: ${mRegDate ? mRegDate[1] : ''}`);
      console.log(`   폐업일자: ${mCloseDate ? mCloseDate[1] : ''}`);
      console.log(`   소재지: ${mAddr ? mAddr[1] : ''}`);
      console.log(`   영업구분: ${r.state}`);

      details.push({
        comp,
        mcst: {
          title: r.title,
          href: r.href,
          regNo: mRegNo ? mRegNo[1] : '',
          regDate: mRegDate ? mRegDate[1] : '',
          closeDate: mCloseDate ? mCloseDate[1] : '',
          addr: mAddr ? mAddr[1] : '',
          state: r.state
        }
      });
      await new Promise(res => setTimeout(res, 200));
    }
  }

  fs.writeFileSync(path.join(SCRATCH_DIR, 'mcst_details.json'), JSON.stringify(details, null, 2), 'utf8');
}

run();
