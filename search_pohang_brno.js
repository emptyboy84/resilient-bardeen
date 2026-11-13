const https = require('https');

https.get('https://contract.pohang.go.kr/contract/contract_info/private_contract/service?cate1=0000&srch_option=business_no&srch_keyword=121-28-52944', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Result len:', d.length);
    const m = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    m.forEach(tr => {
      if (tr.includes('레이시스템') || tr.includes('신기철') || tr.includes('PACS') || tr.includes('view')) {
        console.log('Match:', tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        const hrefMatch = tr.match(/href="([^"]+)"/);
        if (hrefMatch) console.log('HREF:', hrefMatch[1]);
      }
    });
  });
});
