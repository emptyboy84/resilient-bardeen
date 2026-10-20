const fs = require('fs');

async function testGi(giId) {
  const url = `https://www.jobkorea.co.kr/Recruit/GI_Read/${giId}`;
  console.log(`\n=== Checking GI ${giId} ===`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('Len:', html.length);
  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('Phones:', [...new Set(phones || [])]);
  const contact = html.match(/담당자[\s\S]{0,200}/gi);
  console.log('Contact JSON/text:', contact?.slice(0, 2));
}

async function run() {
  await testGi('50096100');
  await testGi('50082276');
}

run();
