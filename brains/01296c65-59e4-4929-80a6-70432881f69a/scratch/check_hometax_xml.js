const https = require('https');

function checkHometax(bno) {
  return new Promise((resolve, reject) => {
    const postData = `<map id="ATTABZAA001R08"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>${bno}</txprDscmNo><dongCode>05</dongCode><psbSearch>Y</psbSearch><map id="userReqPram"/></map>`;

    const options = {
      hostname: 'www.hometax.go.kr',
      port: 443,
      path: '/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
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
    console.log('Hometax XML response:');
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

main();
