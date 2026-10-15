const https = require('https');

async function testNicebiz(bizno) {
  // Check nicebizinfo
  return new Promise((resolve) => {
    https.get(`https://www.nicebizinfo.com/ep/EP0100M001GE.nice?bno=${bizno.replace(/-/g, '')}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', () => resolve(''));
  });
}

async function testCatch(companyName) {
  // Check catch.co.kr or jobkorea or saramin
}

async function run() {
  const bizno = '603-10-85753';
  const nice = await testNicebiz(bizno);
  console.log('Nicebiz length:', nice.length);
  console.log('Nicebiz includes 매출:', nice.includes('매출'));
  if (nice.includes('매출')) {
    const matches = nice.match(/.{0,50}매출.{0,50}/g);
    console.log('Nice matches:', matches?.slice(0, 5));
  }
}

run();
