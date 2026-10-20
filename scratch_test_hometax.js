const https = require('https');

const b_no = '1248802170';
const xml = `<map id="ATTFZZ3001080S"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>${b_no}</txprDscmNo><dongCode>05</dongCode><psbSearch>Y</psbSearch><map id="userReqPagingVO"/></map>`;

const req = https.request('https://teht.hometax.go.kr/wqAction.do?actionId=ATTFZZ3001080S&screenId=UTEAB-AAA13&popupYn=false&realScreenId=', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/xml; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/xml',
    'Content-Length': Buffer.byteLength(xml)
  }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HomeTax status:', res.statusCode);
    console.log('HomeTax resp:\n', d);
  });
});
req.on('error', e => console.error(e));
req.write(xml);
req.end();
