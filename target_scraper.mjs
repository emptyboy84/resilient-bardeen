import https from 'https';

const address = '경남 거제시 장평3로 80 (장평동)';
const keyword = encodeURIComponent(address);
const results = [];

const excludeKeywords = ['은행', '새마을금고', 'CU', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터', '보증', '예비군', '치유', '복덕방', '스튜디오', '음악', '영어', '수학', '스포츠', '클럽', '카페', '커피', '펜션', '밥', '부엌', '전문점', '공인중개사', '행정사', '세무사'];

async function fetchPage(page) {
    return new Promise((resolve, reject) => {
        const url = `https://search.map.kakao.com/mapsearch/map.daum?callback=cb&q=${keyword}&msFlag=A&sort=0&page=${page}`;
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://map.kakao.com/'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonStr = data.replace(/^cb\(/, '').replace(/\);?$/, '');
                    resolve(JSON.parse(jsonStr));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    for (let page = 1; page <= 10; page++) {
        const data = await fetchPage(page);
        if (!data || !data.place || data.place.length === 0) break;
        
        for (const p of data.place) {
            const name = p.name || '';
            const cate = (p.cate_name_depth1 || '') + ' > ' + (p.cate_name_depth2 || '');
            
            let isExcluded = false;
            for (const kw of excludeKeywords) {
                if (name.includes(kw) || cate.includes(kw)) {
                    isExcluded = true;
                    break;
                }
            }
            if (!isExcluded) {
                results.push({ 
                    name: name, 
                    phone: p.phone, 
                    cate: cate,
                    addr: p.address,
                    status: p.biz_status || '운영중'
                });
            }
        }
        if (data.place.length < 15) break;
    }
    
    console.log(`총 검색 결과: ${results.length}건`);
    for (const r of results) {
        console.log(`- ${r.name} | 연락처: ${r.phone || '없음'} | 상태: ${r.status} | 분야: ${r.cate}`);
    }
}
run();
