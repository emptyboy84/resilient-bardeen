async function inspectLinks() {
  const urls = [
    'https://www.jobkorea.co.kr/Recruit/GI_Read/48484633',
    'https://m.jobkorea.co.kr/Recruit/GI_Read/49628593',
    'https://bizwiki.co.kr/biz/7808603354',
    'https://moneypin.biz/bizno/detail/7808603354/'
  ];

  for (let u of urls) {
    try {
      console.log('--- Fetching:', u);
      const res = await fetch(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      console.log('Status:', res.status);
      const text = await res.text();
      const phones = text.match(/(?:010|051|02|070|0507)-[0-9]{3,4}-[0-9]{4}|(?:010|051|02|070)-[0-9]{3,4}-[0-9*]{4}/g);
      console.log('Phones in', u, ':', phones);
      // search for email or 손기혁
      const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      console.log('Emails in', u, ':', emails);
      // print text around 010 or phone
      const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const idx = clean.indexOf('010');
      if (idx !== -1) {
        console.log('Around 010:', clean.substring(Math.max(0, idx - 50), idx + 100));
      }
    } catch (e) {
      console.error('Error on', u, e.message);
    }
  }
}
inspectLinks();
