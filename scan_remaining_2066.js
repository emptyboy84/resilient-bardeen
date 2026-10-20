const https = require('https');
const fs = require('fs');

const targets = JSON.parse(fs.readFileSync('remaining_2066_targets.json', 'utf8'));
const resultsFile = 'remaining_2066_scan_results.json';

let results = {};
if (fs.existsSync(resultsFile)) {
  try {
    results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  } catch (e) {
    results = {};
  }
}

function fetchBizno(bnoClean) {
  return new Promise((resolve) => {
    if (!bnoClean || bnoClean.length !== 10) {
      return resolve({
        statusCategory: '번호없음',
        detail: '10자리 사업자등록번호 없음',
        contact: ''
      });
    }

    const req = https.get('https://bizno.net/article/' + bnoClean, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        // 1. Check contact in meta or table
        let contact = '';
        const phoneMatch = d.match(/0(?:5[1-5]|2|[3-6][1-5]|70|50[0-9]|1[016789])-\d{3,4}-\d{4}|1[568]\d{2}-\d{4}/);
        if (phoneMatch) {
          contact = phoneMatch[0];
        }

        // 2. Check table row for 사업자 현재 상태
        const m = d.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i);
        if (m) {
          const raw = m[1].replace(/<[^>]+>/g, ' ').replace(/※국세청[\s\S]*/, '').replace(/\s+/g, ' ').trim();
          let statusCategory = '미확인';
          if (raw.includes('폐업자')) {
            statusCategory = '폐업';
          } else if (raw.includes('휴업자')) {
            statusCategory = '휴업';
          } else if (raw.includes('계속사업자')) {
            statusCategory = '정상';
          }
          resolve({ statusCategory, detail: raw, contact });
        } else {
          // Check if meta tag has status
          const metaMatch = d.match(/사업자 현재 상태[^\:]*:\s*([^\"]+)/);
          if (metaMatch) {
            const metaRaw = metaMatch[1].trim();
            let statusCategory = '미확인';
            if (metaRaw.includes('폐업자')) statusCategory = '폐업';
            else if (metaRaw.includes('휴업자')) statusCategory = '휴업';
            else if (metaRaw.includes('계속사업자')) statusCategory = '정상';
            resolve({ statusCategory, detail: metaRaw.slice(0, 50), contact });
          } else {
            if (d.includes('조회 결과가 없습니다') || res.statusCode === 404) {
              resolve({ statusCategory: '미등록', detail: '비즈노 미등록', contact });
            } else {
              resolve({ statusCategory: '미확인', detail: '상태값 파싱불가', contact });
            }
          }
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCategory: '타임아웃', detail: '응답 지연', contact: '' });
    });

    req.on('error', (err) => {
      resolve({ statusCategory: '에러', detail: err.message, contact: '' });
    });
  });
}

async function runQueue(items, concurrency = 8) {
  console.log(`Starting scan of remaining ${items.length} companies (concurrency: ${concurrency})...`);
  let index = 0;
  let activeWorkers = 0;
  let completed = 0;
  let closedCount = 0;
  let suspendedCount = 0;

  return new Promise((resolve) => {
    function launchNext() {
      if (index >= items.length && activeWorkers === 0) {
        return resolve();
      }

      while (activeWorkers < concurrency && index < items.length) {
        const item = items[index++];
        activeWorkers++;

        // Skip if already successfully processed
        if (results[item.row] && (results[item.row].statusCategory === '정상' || results[item.row].statusCategory === '폐업' || results[item.row].statusCategory === '휴업')) {
          if (results[item.row].statusCategory === '폐업') closedCount++;
          if (results[item.row].statusCategory === '휴업') suspendedCount++;
          activeWorkers--;
          completed++;
          launchNext();
          continue;
        }

        fetchBizno(item.bnoClean).then((res) => {
          results[item.row] = {
            row: item.row,
            seq: item.seq,
            name: item.name,
            ceo: item.ceo,
            bno: item.bno,
            bnoClean: item.bnoClean,
            corpNo: item.corpNo,
            industry: item.industry,
            address: item.address,
            statusCategory: res.statusCategory,
            detail: res.detail,
            contact: res.contact,
            source: '미발굴군 2066'
          };

          completed++;
          if (res.statusCategory === '폐업') {
            closedCount++;
            console.log(`[★발견 폐업 #${closedCount}] seq: ${item.seq} (행 ${item.row}) | ${item.name} | ${item.bno} | ${res.detail} | 연락처: ${res.contact || '없음'}`);
          } else if (res.statusCategory === '휴업') {
            suspendedCount++;
            console.log(`[★발견 휴업 #${suspendedCount}] seq: ${item.seq} (행 ${item.row}) | ${item.name} | ${item.bno} | ${res.detail} | 연락처: ${res.contact || '없음'}`);
          } else if (completed % 100 === 0 || completed === items.length) {
            console.log(`  [진행] ${completed}/${items.length} 완료... (폐업: ${closedCount}, 휴업: ${suspendedCount})`);
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
  await runQueue(targets, 8);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log('\n2,066개사 전수 스캔 완료!');
}

main().catch(console.error);
