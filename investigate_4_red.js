const https = require('https');

const targets = [
  { seq: 14, name: '(주)쉐어트리츠', ceo: '이홍배', bno: '6258100680' },
  { seq: 318, name: '(주)온클레브', ceo: '정유훈', bno: '5978802100' },
  { seq: 423, name: '(주)페타브루', ceo: '임유진', bno: '1378802456' },
  { seq: 490, name: '(주)바이너리컬', ceo: '민진기', bno: '6128155627' }
];

async function check4() {
  for (const t of targets) {
    console.log(`\n=================== ${t.seq} ${t.name} (${t.ceo}, ${t.bno}) ===================`);
    
    // 1. Bizno
    try {
      const res = await fetch(`https://bizno.net/article/${t.bno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const phones = html.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
      console.log('Bizno phones:', [...new Set(phones || [])].filter(p => !p.includes('9200') && !p.includes('1577-0000')));
    } catch(e) {}

    // 2. Naver
    try {
      const q = `${t.name} ${t.ceo}`;
      const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const phones = html.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
      console.log('Naver phones:', [...new Set(phones || [])].filter(p => !p.includes('9200') && !p.includes('1577-0000') && !p.includes('6226-5000')));
    } catch(e) {}

    // 3. Daum
    try {
      const q = `${t.name} 부산`;
      const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const phones = html.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
      console.log('Daum phones:', [...new Set(phones || [])].filter(p => !p.includes('9200') && !p.includes('1577-0000') && !p.includes('6226-5000')));
    } catch(e) {}
  }
}
check4();
