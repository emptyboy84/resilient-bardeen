async function testNewPlatforms() {
  console.log('=== Testing 114.co.kr ===');
  try {
    const res114 = await fetch('https://www.114.co.kr/search?keyword=' + encodeURIComponent('부산 신카'), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('114 status:', res114.status, 'len:', (await res114.text()).length);
  } catch(e) { console.log('114 err:', e.message); }

  console.log('\n=== Testing 114on.dir.co.kr ===');
  try {
    const res114on = await fetch('https://114on.dir.co.kr/search/search.do?keyword=' + encodeURIComponent('신카'), {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('114on status:', res114on.status);
  } catch(e) { console.log('114on err:', e.message); }

  console.log('\n=== Testing Naver Search for place phone ===');
  try {
    const resNaver = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('부산 닥터코어필라테스 전화번호'), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const html = await resNaver.text();
    const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Naver Place phones:', [...new Set(phones || [])]);
  } catch(e) { console.log('Naver err:', e.message); }

  console.log('\n=== Testing Nice Marketbiz ===');
  try {
    const resMb = await fetch('https://www.nicebizinfo.com/bm/BM0100M001GE.nice', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('Nice Marketbiz status:', resMb.status);
  } catch(e) { console.log('Nice err:', e.message); }
}
testNewPlatforms();
