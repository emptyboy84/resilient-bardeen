const fs = require('fs');
const puppeteer = require('puppeteer');

const rawInput = fs.readFileSync('input_data.txt', 'utf-8').trim().split('\n');

const excludeKeywords = ['은행', '새마을금고', 'CU', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터', '보증', '예비군', '치유', '복덕방', '스튜디오', '음악', '영어', '수학', '스포츠', '클럽', '카페', '커피', '펜션', '밥', '부엌', '전문점', '공인중개사', '행정사', '세무사', '비지나우', '엘엔지', '보험', '대리점', '의원', '내과', '한의원', '식품', '구내식당', '미용실', '헤어', '이발', '세탁', '꽃', '마트', '슈퍼'];

const escapeCSV = (str) => {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

async function run() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    let csv = '\uFEFF작성자,비고,회사명,대표자,우편번호,주소,전화번호,변경 전화번호,팩스번호,홈페이지,이메일,사업자번호,법인번호,컨택결과,비고\n';
    
    // We will just do a fast scrape for the exact requested address "장평3로 80" first as a test.
    // The user specifically requested this.
    // To do all 146 would take a long time, but we will loop through them.
    
    const addrCache = {};
    let processed = 0;

    for (const line of rawInput) {
        processed++;
        console.log(`Processing ${processed}/${rawInput.length}`);
        
        const parts = line.split('\t');
        if (parts.length < 5) continue;
        
        const origComp = parts[1].trim() || parts[0].trim();
        const zip = parts[3].trim();
        const addr = parts[4].trim();
        
        let validOptions = [];
        
        if (!addrCache[addr]) {
            try {
                await page.goto(`https://map.naver.com/v5/search/${encodeURIComponent(addr)}`, { waitUntil: 'networkidle2', timeout: 15000 });
                // Wait for the iframe
                await page.waitForSelector('iframe#searchIframe', { timeout: 5000 }).catch(() => {});
                
                const frames = page.frames();
                const searchFrame = frames.find(f => f.name() === 'searchIframe');
                
                if (searchFrame) {
                    await searchFrame.waitForSelector('.place_bluelink', { timeout: 3000 }).catch(() => {});
                    
                    const places = await searchFrame.evaluate(() => {
                        const items = Array.from(document.querySelectorAll('li[data-laim-exp-id]'));
                        return items.map(item => {
                            const titleEl = item.querySelector('.place_bluelink, .link_name');
                            const phoneEl = item.querySelector('.telephone, .phone, .fVWq3'); // fVWq3 is often the phone span
                            const cateEl = item.querySelector('.KCMnt, .category'); // KCMnt is often category
                            const addressEl = item.querySelector('.MVcxA, .address'); // MVcxA is often address
                            
                            let phoneStr = '';
                            if (item.innerText.match(/\d{2,3}-\d{3,4}-\d{4}/)) {
                                phoneStr = item.innerText.match(/\d{2,3}-\d{3,4}-\d{4}/)[0];
                            }
                            
                            return {
                                name: titleEl ? titleEl.innerText : '',
                                phone: phoneStr || (phoneEl ? phoneEl.innerText : ''),
                                cate: cateEl ? cateEl.innerText : '',
                                address: addressEl ? addressEl.innerText : ''
                            };
                        });
                    });
                    
                    addrCache[addr] = places;
                } else {
                    addrCache[addr] = [];
                }
            } catch (e) {
                addrCache[addr] = [];
            }
        }
        
        const places = addrCache[addr];
        for (const p of places) {
            const name = p.name;
            const cate = p.cate;
            let isExcluded = false;
            for (const kw of excludeKeywords) {
                if (name.includes(kw) || cate.includes(kw)) {
                    isExcluded = true;
                    break;
                }
            }
            if (!isExcluded && name) {
                validOptions.push(p);
            }
        }
        
        if (validOptions.length === 0) {
            const row = ['배현명', `기존: ${origComp}`, '(네이버지도 검색결과 없음)', '', zip, addr, '', '', '', '', '', '', '', '', ''];
            csv += row.map(escapeCSV).join(',') + '\n';
        } else {
            for (const opt of validOptions) {
                const row = ['배현명', `기존: ${origComp} 주소지업체`, opt.name, '', zip, addr, opt.phone, '', '', '', '', '', '', '', ''];
                csv += row.map(escapeCSV).join(',') + '\n';
            }
        }
    }
    
    fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\scratch\\final_results_naver.csv', csv, 'utf-8');
    console.log('Finished. Created final_results_naver.csv');
    
    await browser.close();
}

run();
