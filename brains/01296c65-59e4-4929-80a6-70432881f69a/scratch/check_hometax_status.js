const https = require('https');

// Test querying Hometax status
function checkHometax(bno) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      mapNm: "pubcUserSignMap",
      bno: bno
    });

    const options = {
      hostname: 'www.hometax.go.kr',
      port: 443,
      path: '/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    const res = await checkHometax('1058802863');
    console.log('Hometax raw response:');
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

main();
