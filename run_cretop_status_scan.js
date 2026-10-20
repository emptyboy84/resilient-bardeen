const https = require('https');
const fs = require('fs');

const cretopList = JSON.parse(fs.readFileSync('cretop_733_targets.json', 'utf8'));
const resultsFile = 'cretop_733_scan_results.json';

let results = {};
if (fs.existsSync(resultsFile)) {
  try { results = JSON.parse(fs.readFileSync(resultsFile, 'utf8')); } catch (e) { results = {}; }
}

function fetchBiznoStatus(bnoClean) {
  return new Promise((resolve) => {
    if (!bnoClean || bnoClean.length !== 10) {
      return resolve({ statusCategory: '미등록/번호없음', detail: '10자리 사업자등록번호 없음' });
    }

    const req = https.get('https://bizno.net/article/' + bnoClean, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        const m = d.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        if (m) {
          const raw = m[1].replace(/<[^>]+>/g, ' ').replace(/※국세청[\s\S]*/, '').replace(/\s+/g, ' ').trim();
          let statusCategory = '미확인';
          if (raw.includes('폐업자')) statusCategory = '폐업';
          else if (raw.includes('휴업자')) statusCategory = '휴업';
          else if (raw.includes('계속사업자')) statusCategory = '정상';
          resolve({ statusCategory, detail: raw });
        } else {
          resolve({ statusCategory: '미확인', detail: '상태값 파싱불가' });
        }
      });
    });

    req.on('timeout', () => { req.destroy(); resolve({ statusCategory: '타임아웃', detail: '응답 지연' }); });
    req.on('error', (err) => { resolve({ statusCategory: '에러', detail: err.message }); });
  });
}

async function runQueue(items, concurrency = 6) {
  console.log(`Starting Cretop scan (${items.length} items)...`);
  let index = 0;
  let activeWorkers = 0;
  let completed = 0;

  return new Promise((resolve) => {
    function launchNext() {
      if (index >= items.length && activeWorkers === 0) return resolve();

      while (activeWorkers < concurrency && index < items.length) {
        const item = items[index++];
        activeWorkers++;

        if (results[item.row] && (results[item.row].statusCategory === '정상' || results[item.row].statusCategory === '폐업' || results[item.row].statusCategory === '휴업')) {
          activeWorkers--;
          completed++;
          launchNext();
          continue;
        }

        fetchBiznoStatus(item.bnoClean).then((res) => {
          results[item.row] = {
            row: item.row,
            seq: item.seq,
            name: item.name,
            ceo: item.ceo,
            bno: item.bno,
            bnoClean: item.bnoClean,
            corpNo: item.corpNo,
            phone: item.phone,
            source: '크레탑 원본 기본번호',
            statusCategory: res.statusCategory,
            detail: res.detail
          };

          completed++;
          if (res.statusCategory === '폐업' || res.statusCategory === '휴업') {
            console.log(`[★발견 ${res.statusCategory}] seq: ${item.seq} (행 ${item.row}) | ${item.name} | ${item.bno} | ${res.detail}`);
          } else if (completed % 50 === 0 || completed === items.length) {
            console.log(`  [진행] ${completed}/${items.length} 완료...`);
          }

          if (completed % 50 === 0) {
            fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
          }

          activeWorkers--;
          launchNext();
        });
      }
    }
    launchNext();
  });
}

async function main() {
  await runQueue(cretopList, 6);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log('Cretop 733 scan complete!');
}

main().catch(console.error);
