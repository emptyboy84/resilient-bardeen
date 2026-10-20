const fs = require('fs');

const samples = [
  { seq: 14, name: '(주)쉐어트리츠', biz: '6258100680', addr: '부산 해운대구 센텀동로 45' },
  { seq: 47, name: '(주)스튜디오정글', biz: '8198602478', addr: '부산 해운대구 마린시티3로 51' },
  { seq: 65, name: '오엠엔터프라이즈', biz: '8503200823', addr: '부산 기장군 정관읍 정관중앙로 45' },
  { seq: 66, name: '(주)저스티스어드벤처', biz: '1778100390', addr: '부산 해운대구 센텀중앙로 97' },
  { seq: 87, name: '(주)썬더게임즈', biz: '8678100135', addr: '부산 해운대구 센텀중앙로 97' },
  { seq: 109, name: '(주)아크리아스튜디오', biz: '8078703087', addr: '부산 해운대구 센텀중앙로 97' },
  { seq: 121, name: '비솜(주)', biz: '5388600834', addr: '부산 동구 중앙대로 365' },
  { seq: 147, name: '(주)오앤비스페이스', biz: '5918703125', addr: '부산 해운대구 센텀동로 45' },
  { seq: 148, name: '(주)제리굿컴퍼니', biz: '2698602940', addr: '부산 해운대구 해운대해변로 291' },
  { seq: 150, name: '(주)지알비', biz: '7718100829', addr: '부산 해운대구 달맞이길 30' }
];

function cleanName(raw) {
  return raw.replace(/\(주\)/g, '').replace(/주식회사/g, '').replace(/\(유\)/g, '').trim();
}

async function searchDaum(name, addr) {
  const cName = cleanName(name);
  const q = `${cName} 부산`;
  const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();

    // 1. Check local place box
    // Pattern: class="fn_tit"...> ... <span class="f_url">PHONE</span> ... <span class="txt_address">ADDR</span>
    const placeBlocks = html.match(/class="fn_tit"[\s\S]*?(?:class="txt_address"[\s\S]*?<\/div>|<\/li>)/g) || [];
    for (const block of placeBlocks) {
      const pMatch = block.match(/<span class="f_url">([0-9\-]+)<\/span>/);
      if (pMatch) {
        return { source: 'Daum-Local', phone: pMatch[1], snippet: block.replace(/<[^>]+>/g, ' ').substring(0, 100) };
      }
    }

    // 2. Fallback general snippet
    const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g) || [];
    for (const p of phones) {
      if (['02-1577-0000', '02-6226-5000', '02-3771-1514', '1588-3333'].includes(p)) continue;
      const idx = html.indexOf(p);
      const snippet = html.substring(Math.max(0, idx - 150), Math.min(html.length, idx + 150));
      if (snippet.includes(cName) && (snippet.includes('부산') || addr.split(' ')[1] && snippet.includes(addr.split(' ')[1]))) {
        return { source: 'Daum-Web', phone: p, snippet: snippet.replace(/<[^>]+>/g, ' ').substring(0, 100) };
      }
    }
  } catch (e) {}
  return null;
}

async function searchJobkorea(bizNo) {
  const url = `https://www.jobkorea.co.kr/Company/1801180/Info?BizNo=${bizNo}`; // or company search
  try {
    const res = await fetch(`https://www.jobkorea.co.kr/Search/?stext=${bizNo}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g) || [];
    if (phones.length > 0) {
      return { source: 'Jobkorea', phone: phones[0] };
    }
  } catch (e) {}
  return null;
}

async function run() {
  for (const s of samples) {
    const daumRes = await searchDaum(s.name, s.addr);
    const jkRes = await searchJobkorea(s.biz);
    console.log(`[Seq ${s.seq}] ${s.name} (${s.biz})`);
    if (daumRes) console.log(`   Daum: ${daumRes.phone} [${daumRes.source}] -> ${daumRes.snippet}`);
    if (jkRes) console.log(`   Jobkorea: ${jkRes.phone}`);
    if (!daumRes && !jkRes) console.log(`   -> No hit`);
  }
}

run();
