const https = require('https');

function sendJson(payload) {
  return new Promise((resolve, reject) => {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const options = {
      hostname: 'teht.hometax.go.kr',
      port: 443,
      path: '/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'Referer': 'https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml',
        'Origin': 'https://teht.hometax.go.kr',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const payloads = [
    // 1. Direct fields
    { txprDscmNo: "1058802863", dongCode: "88", psbSearch: "Y" },
    // 2. Wrapped in map
    { map: { id: "ATTABZAA001R08", txprDscmNo: "1058802863", dongCode: "88", psbSearch: "Y" } },
    // 3. Action ID as root
    { ATTABZAA001R08: { txprDscmNo: "1058802863", dongCode: "88", psbSearch: "Y" } }
  ];

  for (let i = 0; i < payloads.length; i++) {
    console.log(`--- Test ${i+1} ---`);
    const res = await sendJson(payloads[i]);
    console.log(res);
  }
}

main();
