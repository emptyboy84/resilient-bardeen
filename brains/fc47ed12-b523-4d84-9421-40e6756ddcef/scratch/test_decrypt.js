const crypto = require('crypto');

const secretKey = "EOyJJlKhWKAwEieaCt7d5ogSTBNNuC7hrkg89A3xOqUhjdmOG8gQrZgmgmu4Xkg8";

function evpBytesToKey(password, salt, keyLen, ivLen) {
  let buffers = [];
  let d_i = Buffer.alloc(0);
  let totalLen = 0;
  while (totalLen < (keyLen + ivLen)) {
    const md5 = crypto.createHash('md5');
    md5.update(d_i);
    md5.update(password);
    md5.update(salt);
    d_i = md5.digest();
    buffers.push(d_i);
    totalLen += d_i.length;
  }
  const full = Buffer.concat(buffers);
  return {
    key: full.slice(0, keyLen),
    iv: full.slice(keyLen, keyLen + ivLen)
  };
}

function decryptNice(encryptedResponse) {
  if (!encryptedResponse) return null;
  const ivHex = encryptedResponse.slice(0, 32);
  const customIv = Buffer.from(ivHex, 'hex');
  const ciphertextB64 = encryptedResponse.slice(32);
  
  const rawCiphertext = Buffer.from(ciphertextB64, 'base64');
  if (rawCiphertext.slice(0, 8).toString('utf8') !== 'Salted__') {
    throw new Error('Not salted');
  }
  const salt = rawCiphertext.slice(8, 16);
  const data = rawCiphertext.slice(16);

  const derived = evpBytesToKey(Buffer.from(secretKey, 'utf8'), salt, 32, 16);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', derived.key, customIv);
  decipher.setAutoPadding(true);
  
  let decrypted = decipher.update(data);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

async function testDecryption() {
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
    const decrypted = decryptNice(json.encryptedResponse);
    console.log(`=== BNO ${bno} ===`);
    console.log(`Name: ${decrypted.data?.items?.[0]?.korentrnm}`);
    console.log(`Industry (sanupscd_kor): ${decrypted.data?.items?.[0]?.sanupscd_kor}`);
    console.log(`Representative: ${decrypted.data?.items?.[0]?.korreprnm}`);
  }
}

testDecryption();
