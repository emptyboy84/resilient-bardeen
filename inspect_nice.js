async function inspectNice() {
  const sampleBiz = '7518103079'; // 메이브릿지
  const res = await fetch(`https://www.nicebizinfo.com/ep/EP0100M001GE.nice?itm_cmp_cd=${sampleBiz}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const text = await res.text();
  console.log('Nice status:', res.status);
  
  // check if phone or tel exists
  const telMatches = text.match(/(?:전화|TEL|Tel|연락처)[^<]{0,50}/gi);
  console.log('Tel matches:', telMatches);

  const phoneMatches = text.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phone matches in Nice:', phoneMatches);
}
inspectNice();
