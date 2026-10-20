const fs = require('fs');

async function probeSsgSellerApi() {
  const sellerId = '214249';
  const urls = [
    `https://www.ssg.com/sellerhome/${sellerId}/info.ssg`,
    `https://m.ssg.com/sellerhome/${sellerId}/info.ssg`,
    `https://www.ssg.com/sellerhome/sellerInfoAjax.ssg?sellerId=${sellerId}`,
    `https://m.ssg.com/api/seller/${sellerId}`,
    `https://m.ssg.com/sellerhome/getSellerInfo.ssg?sellerId=${sellerId}`,
    `https://www.ssg.com/item/sellerInfoPop.ssg?sellerId=${sellerId}`
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = await res.text();
      console.log(u, '-> Status:', res.status, 'Len:', text.length);
      const phones = text.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
      if (phones) console.log('   Phones:', [...new Set(phones)]);
    } catch(e) {
      console.log(u, '-> Err:', e.message);
    }
  }
}

probeSsgSellerApi();
