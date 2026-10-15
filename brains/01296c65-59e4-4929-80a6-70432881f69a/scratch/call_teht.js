const https = require('https');

function checkHometax(bno) {
  return new Promise((resolve, reject) => {
    const cleanNo = bno.replace(/[^0-9]/g, '');
    const dongCode = cleanNo.substring(3, 5);
    const body = `<map id="ATTABZAA001R08">
<pubcUserNo/>
<mobYn>N</mobYn>
<inqrTrgtClCd>1</inqrTrgtClCd>
<txprDscmNo>${cleanNo}</txprDscmNo>
<dongCode>${dongCode}</dongCode>
<psbSearch>Y</psbSearch>
<map id="userReqInfoVO"/>
</map>`;

    const options = {
      hostname: 'teht.hometax.go.kr',
      port: 443,
      path: '/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Accept': 'application/xml; charset=UTF-8',
        'Referer': 'https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml',
        'Origin': 'https://teht.hometax.go.kr',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    const res = await checkHometax('1058802863');
    console.log('=== HOMETAX RESPONSE ===');
    console.log(res);
  } catch(e) {
    console.error(e);
  }
}

main();
