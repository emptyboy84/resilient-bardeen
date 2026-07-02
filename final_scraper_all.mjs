import fs from 'fs';
import https from 'https';

const rawInput = fs.readFileSync('input_data.txt', 'utf-8').trim().split('\n');

const excludeKeywords = ['은행', '새마을금고', 'CU', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터', '보증', '예비군', '치유', '복덕방', '스튜디오', '음악', '영어', '수학', '스포츠', '클럽', '카페', '커피', '펜션', '밥', '부엌', '전문점', '공인중개사', '행정사', '세무사', '비지나우', '엘엔지', '보험', '대리점', '의원', '내과', '한의원', '식품', '구내식당', '미용실', '헤어', '이발', '세탁', '꽃', '마트', '슈퍼'];

async function searchAddress(addr) {
    return new Promise((resolve) => {
        const url = `https://search.map.kakao.com/mapsearch/map.daum?callback=cb&q=${encodeURIComponent(addr)}&msFlag=A&sort=0`;
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
                    const firstBrace = data.indexOf('{');
                    const lastBrace = data.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1) {
                        const jsonStr = data.substring(firstBrace, lastBrace + 1);
                        resolve(JSON.parse(jsonStr));
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    console.log('JSON Parse Error:', e);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

const escapeCSV = (str) => {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

async function run() {
    let csv = '\uFEFF작성자,비고,회사명,대표자,우편번호,주소,전화번호,변경 전화번호,팩스번호,홈페이지,이메일,사업자번호,법인번호,컨택결과,비고\n';

    // To avoid searching the same address repeatedly
    const addrCache = {};

    let processed = 0;
    for (const line of rawInput) {
        if (processed % 50 === 0) console.log(`Processed ${processed}/${rawInput.length}`);
        processed++;
        
        const parts = line.split('\t');
        if (parts.length < 5) continue;
        
        const origComp = parts[1].trim() || parts[0].trim();
        const zip = parts[3].trim();
        const addr = parts[4].trim();
        
        // Search the company specifically first
        let cleanName = origComp.replace('(주)', '').trim();
        let qComp = `거제 ${cleanName}`;
        if (!addr.includes('거제')) qComp = cleanName; 
        // Actually, just search the company name + city
        const cityMatch = addr.match(/^(경남|부산|울산) (.*?시|.*?군)/);
        if (cityMatch) {
            qComp = `${cityMatch[2]} ${cleanName}`;
        }
        
        let foundPlaces = [];
        const compRes = await searchAddress(qComp);
        
        if (compRes && compRes.place && compRes.place.length > 0) {
            foundPlaces = compRes.place;
        } else {
            // Fallback to address search
            if (!addrCache[addr]) {
                const cleanAddr = addr.replace(/\(.*?\)/g, '').split(',')[0].trim();
                const addrRes = await searchAddress(cleanAddr);
                addrCache[addr] = (addrRes && addrRes.place) ? addrRes.place : [];
            }
            foundPlaces = addrCache[addr];
        }
        
        // Filter places
        const validOptions = [];
        for (const p of foundPlaces) {
            const name = p.name || '';
            const phone = p.phone || '';
            const status = p.biz_status || '';
            const cate = (p.cate_name_depth1 || '') + (p.cate_name_depth2 || '');
            
            // "되도록이면 운영하는데 ㅍ폐업은 당영ㄴ히 배제하고" -> Exclude closed ones
            if (status.includes('폐업')) continue;
            
            let isExcluded = false;
            for (const kw of excludeKeywords) {
                if (name.includes(kw) || cate.includes(kw)) {
                    isExcluded = true;
                    break;
                }
            }
            
            if (!isExcluded) {
                // If it's a shipyard address, only add if it actually looks like a manufacturer or company to reduce noise
                validOptions.push({ name, phone, address: p.address });
            }
        }
        
        if (validOptions.length === 0) {
            const row = ['배현명', `기존: ${origComp}`, '(운영중인 해당업체/대체업체 없음)', '', zip, addr, '', '', '', '', '', '', '', '', ''];
            csv += row.map(escapeCSV).join(',') + '\n';
        } else {
            // Output ALL valid options for this row
            for (const opt of validOptions) {
                const row = ['배현명', `기존: ${origComp} 주소지업체`, opt.name, '', zip, addr, opt.phone, '', '', '', '', '', '', '', ''];
                csv += row.map(escapeCSV).join(',') + '\n';
            }
        }
    }
    
    fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\scratch\\final_results_all.csv', csv, 'utf-8');
    console.log('Finished. Created final_results_all.csv');
}
run();
