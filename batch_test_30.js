const fs = require('fs');

async function runBatchTest() {
  const missing = JSON.parse(fs.readFileSync('missing_phone_targets.json', 'utf8'));
  console.log('Total targets:', missing.length);

  const sample = missing.slice(0, 30);
  const results = [];

  for (let i = 0; i < sample.length; i++) {
    const item = sample[i];
    const cleanBizNo = item.bizNo.replace(/[^0-9]/g, '');
    let phone = '';

    if (cleanBizNo.length === 10) {
      try {
        const url = 'https://bizno.net/article/' + cleanBizNo;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (res.ok) {
          const html = await res.text();
          const thMatch = html.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
          if (thMatch) {
            const inner = thMatch[1];
            const telMatch = inner.match(/<a href=['"]tel:([^'"]+)['"]/) || inner.match(/([0-9]{2,4}-[0-9]{3,4}-[0-9]{4}|1[0-9]{3}-[0-9]{4})/);
            if (telMatch) {
              phone = telMatch[1].trim();
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching ${item.name}:`, err.message);
      }
    }

    results.push({
      seq: item.seq,
      name: item.name,
      ceo: item.ceo,
      bizNo: item.bizNo,
      phone: phone
    });

    console.log(`[${i+1}/${sample.length}] ${item.seq} ${item.name} -> ${phone || '미확인'}`);
    await new Promise(r => setTimeout(r, 400));
  }

  const foundCount = results.filter(r => r.phone).length;
  console.log(`\nSample result: ${foundCount}/${sample.length} found (${(foundCount/sample.length*100).toFixed(1)}%)`);
}

runBatchTest();
