const CryptoJS = require('c:/Users/lg/resilient-bardeen/node_modules/crypto-js');

const secretKey = "EOyJJlKhWKAwEieaCt7d5ogSTBNNuC7hrkg89A3xOqUhjdmOG8gQrZgmgmu4Xkg8";

function decryptNice(v) {
  if (!v) return null;
  const [y, E] = [v.slice(0, 32), v.slice(32)];
  const bytes = CryptoJS.AES.decrypt(E, secretKey, {
    iv: CryptoJS.enc.Hex.parse(y),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  const text = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(text);
}

async function test() {
  const bnos = ['5131909625', '5132200420', '5138144615', '5138531350', '5138602624'];
  for (const bno of bnos) {
    const url = `https://www.nicebizinfo.com/nuxtApi/search/SR01/sr01M03Get.nice?srchNm=${bno}&srchkwrd=ALL&prn_cnt=10&pge_no=1&useOrgTotal=false`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.nicebizinfo.com/ep/EP0100M001GE.nice?keyword=' + bno,
        'Accept': 'application/json, text/plain, */*'
      }
    });
    const json = await res.json();
    if (json.encryptedResponse) {
      const data = decryptNice(json.encryptedResponse);
      const item = data.data?.items?.item?.[0];
      console.log(`BNO ${bno}:`, item?.korentrnm, '-> 산업명:', item?.sanupscd_kor);
    } else {
      console.log(`BNO ${bno}: no encryptedResponse`);
    }
  }
}

test();
