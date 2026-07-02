import fs from 'fs';
import https from 'https';

const rawInput = fs.readFileSync('input_data.txt', 'utf-8').trim().split('\n');
const targets = [];

for (const line of rawInput) {
    const parts = line.split('\t');
    if (parts.length >= 5) {
        const comp = parts[1].trim() || parts[0].trim();
        const addr = parts[4].trim();
        
        if (addr.includes('장평3로 80') || addr.includes('거제대로 3370') || addr.includes('장평동')) {
            targets.push(comp);
        }
    }
}

console.log(`Found ${targets.length} target companies in the shipyards.`);

async function searchCompany(comp) {
    const cleanName = comp.replace('(주)', '').trim();
    // try searching just the company name
    const q = encodeURIComponent(`거제 ${cleanName}`);
    
    return new Promise((resolve) => {
        const url = `https://search.map.kakao.com/mapsearch/map.daum?callback=cb&q=${q}&msFlag=A&sort=0`;
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
                    const json = JSON.parse(jsonStr);
                    resolve(json);
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    for (const comp of targets) {
        const data = await searchCompany(comp);
        if (data && data.place && data.place.length > 0) {
            // Find best match
            const p = data.place[0]; // just grab first
            console.log(`[${comp}] -> 발견: ${p.name} | 연락처: ${p.phone || '없음'} | 상태: ${p.biz_status || '운영중'} | 주소: ${p.address}`);
        } else {
            console.log(`[${comp}] -> 검색결과 없음`);
        }
    }
}

run();
