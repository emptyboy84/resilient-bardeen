const https = require('https');

const idxs = ['202600210911', '202500210517', '202500210128', '202400210592', '202400210281'];

async function checkIdx(idx) {
  return new Promise(resolve => {
    https.get(`https://contract.pohang.go.kr/contract/contract_info/private_contract/service?idx=${idx}&mode=view`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const phoneMatch = text.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|054[- ]?\d{3,4}[- ]?\d{4}/g) || [];
        console.log(`IDX ${idx} phones:`, [...new Set(phoneMatch)]);
        resolve();
      });
    });
  });
}

async function main() {
  for (const idx of idxs) {
    await checkIdx(idx);
  }
}
main();
