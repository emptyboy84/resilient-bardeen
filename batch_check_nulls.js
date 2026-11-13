const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const nullList = [
  { no: 1048, name: '디올림엑스(주)', ceo: '이진영', brno: '7648703422' },
  { no: 1049, name: '(주)바이너리티', ceo: '노상호', brno: '4618602513' },
  { no: 1050, name: '다불러', ceo: '도현진', brno: '2162600721' },
  { no: 1053, name: '카마인텔리전스테크놀로지(주)', ceo: '이준오', brno: '5768702831' },
  { no: 1054, name: '(주)혜성씨앤디', ceo: '정문영', brno: '3988603344' },
  { no: 1069, name: '(주)인텔리데이터소프트', ceo: '윤일한', brno: '2688702930' },
  { no: 1072, name: '(주)제니원', ceo: '이재원', brno: '5248601718' },
  { no: 1074, name: '(주)큐큐', ceo: '우성목', brno: '4708702299' },
  { no: 1078, name: '(주)웰메틱스아이앤씨', ceo: '강제임스', brno: '3788701863' },
  { no: 1079, name: '(주)블록인바다', ceo: '안철우', brno: '2878802700' },
  { no: 1083, name: '(주)초이스', ceo: '최기현', brno: '1448138673' },
  { no: 1120, name: '빨간고양이단(주)', ceo: '이준석', brno: '7848603147' },
  { no: 1124, name: '(주)디지콘', ceo: '김기연', brno: '5548102616' },
  { no: 1135, name: '(주)인우랩', ceo: '이동길', brno: '4018602715' },
  { no: 1143, name: '(주)리액트리', ceo: '김성언', brno: '3088147820' },
  { no: 1144, name: '(주)에듀포트', ceo: '유지혜', brno: '6708703369' },
  { no: 1155, name: '(주)위클리벤처스', ceo: '이상민', brno: '2988103146' },
  { no: 1173, name: '(주)메덕스', ceo: '김동현', brno: '3388603513' },
  { no: 1176, name: '(주)엠아이미디어', ceo: '이동근', brno: '8618603328' }
];

async function checkOne(t) {
  return new Promise(resolve => {
    https.get(`https://bizno.net/article/${t.brno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const phoneMatch = text.match(/전화번호\s*([0-9-]{9,14})/);
        const teleMatch = text.match(/통신판매업번호\s*([^ ]+)/);
        const homeMatch = text.match(/홈페이지\s*([^ ]+)/);
        const addrMatch = text.match(/회사주소\s*([^관]+)/);
        const statusMatch = text.match(/사업자 현재 상태\s*([^※<]+)/);
        
        const phone = phoneMatch ? phoneMatch[1] : null;
        const tele = teleMatch ? teleMatch[1] : null;
        const home = homeMatch ? homeMatch[1] : null;
        const status = statusMatch ? statusMatch[1].replace(/&nbsp;/g, '').trim() : '';
        
        console.log(`[${t.no} ${t.name}] 상태:${status} | 폰:${phone} | 통판:${tele} | 홈:${home}`);
        resolve({ ...t, status, phone, tele, home, addr: addrMatch ? addrMatch[1].trim() : '' });
      });
    }).on('error', e => resolve({ ...t, error: e.message }));
  });
}

async function run() {
  console.log(`Checking ${nullList.length} corporate targets on Bizno...`);
  const results = [];
  for (const t of nullList) {
    results.push(await checkOne(t));
  }
  fs.writeFileSync('bizno_check_results.json', JSON.stringify(results, null, 2));
}
run();
