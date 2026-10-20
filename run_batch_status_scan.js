const https = require('https');
const fs = require('fs');
const path = require('path');

const dataFile = 'target_companies_status_check.json';
const resultsFile = 'status_scan_results.json';

const targetData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const userList = targetData.userList; // 240 items
const aiList = targetData.aiList;     // 939 items

// Load existing progress if any
let results = {};
if (fs.existsSync(resultsFile)) {
  try {
    results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  } catch (e) {
    results = {};
  }
}

function fetchBiznoStatus(bnoClean) {
  return new Promise((resolve) => {
    if (!bnoClean || bnoClean.length !== 10) {
      return resolve({
        statusCategory: '미등록/번호없음',
        detail: '10자리 사업자등록번호 없음',
        raw: ''
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
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        // Match table row specifically
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
          resolve({ statusCategory, detail: raw, raw });
        } else {
          // If no table row found, check meta tag or page not found
          if (d.includes('조회 결과가 없습니다') || d.includes('검색결과가 없습니다')) {
            resolve({ statusCategory: '미등록', detail: '비즈노 미등록', raw: '' });
          } else {
            resolve({ statusCategory: '미확인', detail: '상태값 파싱불가', raw: '' });
          }
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCategory: '타임아웃', detail: '응답 지연', raw: '' });
    });

    req.on('error', (err) => {
      resolve({ statusCategory: '에러', detail: err.message, raw: '' });
    });
  });
}

async function runQueue(items, concurrency = 5, batchName = 'Batch') {
  console.log(`\nStarting ${batchName} (${items.length} items, concurrency: ${concurrency})...`);
  let index = 0;
  let activeWorkers = 0;
  let completed = 0;

  return new Promise((resolve) => {
    function launchNext() {
      if (index >= items.length && activeWorkers === 0) {
        return resolve();
      }

      while (activeWorkers < concurrency && index < items.length) {
        const item = items[index++];
        activeWorkers++;

        // Skip if already done
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
            source: item.source || batchName,
            statusCategory: res.statusCategory,
            detail: res.detail
          };

          completed++;
          if (res.statusCategory === '폐업' || res.statusCategory === '휴업') {
            console.log(`[★발견 ${res.statusCategory}] seq: ${item.seq} (행 ${item.row}) | ${item.name} | ${item.bno} | ${res.detail}`);
          } else if (completed % 25 === 0 || completed === items.length) {
            console.log(`  [진행] ${completed}/${items.length} 완료...`);
          }

          // Save checkpoint every 25 items
          if (completed % 25 === 0) {
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
  const mode = process.argv[2] || 'all'; // 'user' or 'ai' or 'all'

  // Tag sources
  userList.forEach(x => x.source = '배현명 님 추가분');
  aiList.forEach(x => x.source = 'AI 신규 발굴분');

  if (mode === 'user') {
    await runQueue(userList, 5, '배치 1: 배현명 님 추가분 (240건)');
  } else if (mode === 'ai') {
    await runQueue(aiList, 5, '배치 2~6: AI 신규 발굴분 (939건)');
  } else {
    console.log('=== Step 1: 배현명 님 추가분 (240건) 스캔 ===');
    await runQueue(userList, 5, '배현명 님 추가분 (240건)');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    console.log('\n=== Step 2: AI 신규 발굴분 (939건) 스캔 ===');
    await runQueue(aiList, 5, 'AI 신규 발굴분 (939건)');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  }

  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log('\n전수 스캔 완료! resultsFile 저장 완료.');
}

main().catch(console.error);
