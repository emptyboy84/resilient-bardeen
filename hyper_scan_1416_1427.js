const https = require('https');
const http = require('http');

const targets = [
    { seq: 1416, name: '루프노트', ceo: '정현수', bno: '196-93-02034', addr: '부산 수영구 광남로 89, 206호 (광안동,글로벌하일타운)' },
    { seq: 1417, name: '제이픽쳐스', ceo: '최재준', bno: '406-32-01213', addr: '부산 북구 만덕1로104번길 29, 108동 1006호 (덕천동,기비골마을)' },
    { seq: 1418, name: '피나이아줌마', ceo: 'CABUELLO JOVELYN', bno: '768-90-01969', addr: '부산 기장군 정관읍 정관2로 24, 201동 1202호 (모전리,휴먼시아2차아파트)' },
    { seq: 1419, name: '스위치스튜디오', ceo: '김태원', bno: '403-27-01258', addr: '부산 수영구 좌수영로 192, 304동 1603호 (망미동,수영강변e편한세상3차)' },
    { seq: 1420, name: '응아뽕', ceo: '김재열', bno: '314-40-00977', addr: '부산 해운대구 수영강변대로 140, 5층 콘텐츠코리아 랩 오픈오피스(우동,부산문화콘텐츠컴플렉스)' },
    { seq: 1421, name: '류류이엔티', ceo: '이승경', bno: '728-11-02738', addr: '부산 금정구 금정로233번길 41 (구서동)' },
    { seq: 1422, name: '왓츠비', ceo: '김덕원', bno: '482-09-03236', addr: '부산 남구 용소로14번길 30, L동 2층 1호(대연동,스케일업)' },
    { seq: 1423, name: '킨레', ceo: '정승원', bno: '283-23-02465', addr: '부산 기장군 정관읍 산단2로 60, 502동 602호 (달산리,엘에이치5단지)' },
    { seq: 1424, name: '아랫집해파리', ceo: '변서영', bno: '493-43-01192', addr: '부산 동구 초량중로 11-1, 1층 (초량동)' },
    { seq: 1425, name: '디슈팀메', ceo: '김효빈', bno: '654-90-01826', addr: '부산 수영구 황령산로7번길 45, 헤리티지 남천 601호 (남천동)' },
    { seq: 1426, name: '챔팩미디어', ceo: '김태연', bno: '497-36-01444', addr: '부산 영도구 태종로292번길 12, 403호 (청학동,동삼빌리지)' },
    { seq: 1427, name: '레디액션', ceo: '박준영', bno: '601-09-92780', addr: '부산 금정구 금샘로 501-1, 2층 레디액션 (남산동)' }
];

function fetchUrl(url, timeoutMs = 6000) {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: timeoutMs
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let nextUrl = res.headers.location;
                if (!nextUrl.startsWith('http')) {
                    nextUrl = new URL(nextUrl, url).toString();
                }
                return resolve(fetchUrl(nextUrl, timeoutMs));
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        });
        req.on('error', e => resolve({ statusCode: 500, error: e.message, body: '' }));
        req.on('timeout', () => { req.destroy(); resolve({ statusCode: 408, body: '' }); });
    });
}

function extractPhones(text) {
    if (!text) return [];
    const matches = text.match(/(0\d{1,2}-\d{3,4}-\d{4})/g);
    if (!matches) return [];
    // Filter out common fake/sample or customer center of the platform
    const filtered = matches.filter(p => !p.startsWith('02-717-8289') && !p.startsWith('02-15') && !p.startsWith('1588') && !p.startsWith('02-6227'));
    return Array.from(new Set(filtered));
}

async function run() {
    for (const t of targets) {
        const cleanNo = t.bno.replace(/[^0-9]/g, '');
        console.log(`\n========================================`);
        console.log(`[${t.seq}] ${t.name} (${t.ceo}) - ${t.bno}`);
        
        // 1. Bizno
        const biznoRes = await fetchUrl(`https://bizno.net/?query=${cleanNo}`);
        const biznoPhones = extractPhones(biznoRes.body);
        if (biznoPhones.length) console.log(`[비즈노]`, biznoPhones);

        // 2. Moneypin
        const moneypinRes = await fetchUrl(`https://moneypin.biz/bizno/detail/${cleanNo}/`);
        const moneypinPhones = extractPhones(moneypinRes.body);
        if (moneypinPhones.length) console.log(`[머니핀]`, moneypinPhones);

        // 3. MarketBz
        const marketbzRes = await fetchUrl(`https://marketbz.com/companyDetail/${cleanNo}`);
        const marketbzPhones = extractPhones(marketbzRes.body);
        if (marketbzPhones.length) console.log(`[마켓비즈]`, marketbzPhones);

        // 4. CookieDeal
        const cookiedealRes = await fetchUrl(`https://cookiedeal.io/company-search/${cleanNo}/${encodeURIComponent(t.name)}`);
        const cookiedealPhones = extractPhones(cookiedealRes.body);
        if (cookiedealPhones.length) console.log(`[쿠키딜]`, cookiedealPhones);

        if (!biznoPhones.length && !moneypinPhones.length && !marketbzPhones.length && !cookiedealPhones.length) {
            console.log(`-> 4대 플랫폼(비즈노, 머니핀, 마켓비즈, 쿠키딜) 대외 유선전화 미개설 확인`);
        }
    }
}

run();
