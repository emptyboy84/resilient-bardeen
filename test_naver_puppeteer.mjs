import puppeteer from 'puppeteer';

const excludeKeywords = ['은행', '새마을금고', 'CU', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터', '보증', '예비군', '치유', '복덕방', '스튜디오', '음악', '영어', '수학', '스포츠', '클럽', '카페', '커피', '펜션', '밥', '부엌', '전문점', '공인중개사', '행정사', '세무사', '비지나우', '엘엔지', '보험', '대리점', '의원', '내과', '한의원', '식품', '구내식당', '미용실', '헤어', '이발', '세탁', '꽃', '마트', '슈퍼'];

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    const addr = '경남 거제시 장평3로 80';
    console.log(`Searching Naver map for: ${addr}`);
    
    await page.goto(`https://map.naver.com/v5/search/${encodeURIComponent(addr)}`, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Wait for the iframe
    await page.waitForSelector('iframe#searchIframe', { timeout: 10000 }).catch(() => {});
    
    const frames = page.frames();
    const searchFrame = frames.find(f => f.name() === 'searchIframe');
    
    let validOptions = [];
    
    if (searchFrame) {
        await searchFrame.waitForSelector('.place_bluelink', { timeout: 5000 }).catch(() => {});
        
        const places = await searchFrame.evaluate(() => {
            const items = Array.from(document.querySelectorAll('li[data-laim-exp-id]'));
            return items.map(item => {
                const titleEl = item.querySelector('.place_bluelink, .link_name');
                let phoneStr = '';
                const text = item.innerText;
                const match = text.match(/\d{2,3}-\d{3,4}-\d{4}/);
                if (match) phoneStr = match[0];
                return {
                    name: titleEl ? titleEl.innerText : '',
                    phone: phoneStr,
                    rawText: text.replace(/\n/g, ' | ')
                };
            });
        });
        
        for (const p of places) {
            const name = p.name;
            let isExcluded = false;
            for (const kw of excludeKeywords) {
                if (name.includes(kw) || p.rawText.includes(kw)) {
                    isExcluded = true;
                    break;
                }
            }
            if (!isExcluded && name) {
                validOptions.push(p);
            }
        }
    }
    
    console.log(`Found ${validOptions.length} valid manufacturers.`);
    for(const opt of validOptions) {
        console.log(`- ${opt.name} | 연락처: ${opt.phone}`);
    }
    
    await browser.close();
}

run().catch(console.error);
