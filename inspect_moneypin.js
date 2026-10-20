const https = require('https');

async function inspectMoneypin() {
  try {
    const res = await fetch('https://moneypin.biz/bizno/detail/4528803055/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    console.log('Moneypin len:', html.length);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Moneypin snippet:', text.slice(0, 1000));
    const phones = html.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Moneypin phones:', [...new Set(phones || [])]);
  } catch(e) {
    console.log('Moneypin err:', e.message);
  }

  try {
    const res2 = await fetch('https://bigvalue.ai/dashboard/biz/4528803055', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html2 = await res2.text();
    console.log('Bigvalue len:', html2.length);
    const text2 = html2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Bigvalue snippet:', text2.slice(0, 1000));
    const phones2 = html2.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Bigvalue phones:', [...new Set(phones2 || [])]);
  } catch(e) {
    console.log('Bigvalue err:', e.message);
  }
}
inspectMoneypin();
