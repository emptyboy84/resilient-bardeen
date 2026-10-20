async function probePlatforms() {
  const sampleBiz = '7518103079'; // 메이브릿지
  const sampleName = '메이브릿지';

  console.log('--- Probing Moneypin ---');
  try {
    const res = await fetch(`https://moneypin.biz/bizinfo/${sampleBiz}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Moneypin status:', res.status);
    const text = await res.text();
    console.log('Moneypin length:', text.length, 'Contains phone?:', text.includes('070-') || text.includes('전화'));
    if (text.length < 500) console.log('Moneypin body:', text);
  } catch (e) {
    console.log('Moneypin err:', e.message);
  }

  console.log('--- Probing Kookiedil ---');
  try {
    const res = await fetch(`https://kookiedil.com/company/${sampleBiz}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Kookiedil status:', res.status);
  } catch (e) {
    console.log('Kookiedil err:', e.message);
  }

  console.log('--- Probing NiceBizInfo ---');
  try {
    const res = await fetch(`https://www.nicebizinfo.com/ep/EP0100M001GE.nice?itm_cmp_cd=${sampleBiz}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Nice status:', res.status);
    const text = await res.text();
    console.log('Nice text len:', text.length);
  } catch (e) {
    console.log('Nice err:', e.message);
  }

  console.log('--- Probing Daum Web Search ---');
  try {
    const res = await fetch(`https://search.daum.net/search?w=tot&q=${encodeURIComponent('메이브릿지 부산')}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Daum status:', res.status);
    const text = await res.text();
    console.log('Daum contains 070?:', text.includes('070-4219-7808'));
    const phoneMatches = text.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Daum phones found:', phoneMatches);
  } catch (e) {
    console.log('Daum err:', e.message);
  }

  console.log('--- Probing Naver Mobile Search ---');
  try {
    const res = await fetch(`https://m.search.naver.com/search.naver?query=${encodeURIComponent('메이브릿지 부산')}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' }
    });
    console.log('Naver Mobile status:', res.status);
    const text = await res.text();
    console.log('Naver Mobile contains 070?:', text.includes('070-4219-7808'));
    const phoneMatches = text.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Naver phones found:', phoneMatches);
  } catch (e) {
    console.log('Naver err:', e.message);
  }
}
probePlatforms();
