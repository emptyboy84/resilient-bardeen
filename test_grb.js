const fs = require('fs');

async function testGrb() {
  const biz = '7718100829';
  const corp = '1801111128312';

  // 1. Bizno check
  console.log('--- Checking Bizno ---');
  try {
    const res = await fetch(`https://bizno.net/article/${biz}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const thMatch = html.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    console.log('Bizno phone td:', thMatch ? thMatch[1].replace(/<[^>]+>/g, ' ').trim() : 'NONE');
    const allPhones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9*]{4}/g);
    console.log('Bizno all phones:', allPhones);
  } catch(e) {
    console.log('Bizno err:', e.message);
  }

  // 2. Saramin check
  console.log('\n--- Checking Saramin ---');
  try {
    const res = await fetch(`https://www.saramin.co.kr/zf_user/company-info/view?csn=${biz}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9*]{4}/g);
    console.log('Saramin phones:', phones);
    const telMatch = html.match(/(?:전화|연락처|TEL|대표번호)[^0-9<]{0,20}([0-9]{2,4}-[0-9]{3,4}-[0-9*]{4})/i);
    console.log('Saramin tel match:', telMatch ? telMatch[1] : 'NONE');
  } catch(e) {
    console.log('Saramin err:', e.message);
  }

  // 3. SSG Seller info modal
  console.log('\n--- Checking SSG Seller ---');
  try {
    // Seller Info pop URL pattern in SSG
    const res = await fetch('https://m.ssg.com/sellerhome/214249.ssg', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const sellerInfoId = html.match(/sellerId\s*[:=]\s*["']?([0-9]+)["']?/i);
    console.log('Seller ID match:', sellerInfoId ? sellerInfoId[1] : 'NONE');
    // find popup
    const popupUrls = html.match(/https?:\/\/[^"'\s]+seller[^"'\s]+/gi);
    console.log('Popup URLs:', popupUrls);
  } catch(e) {
    console.log('SSG err:', e.message);
  }
}

testGrb();
