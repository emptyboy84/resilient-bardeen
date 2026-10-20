const fs = require('fs');

function searchInObj(obj, name) {
  for (const [k, v] of Object.entries(obj)) {
    const s = JSON.stringify(v);
    if (s.includes('9226') || s.includes('2309')) {
      console.log(`Found in ${name} key ${k}:`, v);
    }
  }
}

const s1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
searchInObj(s1, 'Stage1');

const s2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
searchInObj(s2, 'Stage2');

const s3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};
searchInObj(s3, 'Stage3');

const s4 = fs.existsSync('stage4_verified_results.json') ? JSON.parse(fs.readFileSync('stage4_verified_results.json', 'utf8')) : {};
searchInObj(s4, 'Stage4');

// Also check in cretap missing targets
const missing = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
for (const m of missing) {
  const s = JSON.stringify(m);
  if (s.includes('9226') || s.includes('2309')) {
    console.log('Found in missing target:', m);
  }
}
