const https = require('https');

async function checkAddr() {
  const queries = [
    '"광서로11번길 17"',
    '"광안동 158-45"',
    '"명인방"',
    '"화목오피스텔" 1312',
    '"화목오피스텔" 13층 12호',
    '"수영로 668" 1312',
    '"수영로 668" 13층',
    '글로그림 송대일',
    '송대일 광안동',
    '송대일 수영구'
  ];

  for (const q of queries) {
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    const validPhones = [...new Set(phones || [])].filter(p => !p.includes('9200') && !p.includes('1577-0000'));
    if (validPhones.length > 0) {
      console.log(`[${q}] Phones:`, validPhones);
    }
  }
}
checkAddr();
