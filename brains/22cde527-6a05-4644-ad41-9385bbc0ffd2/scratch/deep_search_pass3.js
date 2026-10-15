const fs = require('fs');
const https = require('https');

const missing = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/missing_421.json', 'utf8'));
const v = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/verified_results.json', 'utf8'));

const unverified = missing.filter(m => !v[String(m.rowNumber)] || !v[String(m.rowNumber)].bizno);
console.log('Total unverified remaining to test:', unverified.length);

function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

async function fetchUrl(url) {
    return new Promise(resolve => {
        const u = new URL(url);
        const req = https.request({
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 5000
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', () => resolve(''));
        req.on('timeout', () => { req.destroy(); resolve(''); });
        req.end();
    });
}

async function searchDaum(q) {
    const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
    return await fetchUrl(url);
}

async function main() {
    let newlyFound = 0;
    // Test first 50 unverified
    for (let i = 0; i < Math.min(unverified.length, 50); i++) {
        const u = unverified[i];
        const cleanName = u.name.replace(/\(주\)|주식회사/g, '').trim();
        if (cleanName.length < 2) continue;

        // Search 1: Name + Busan
        const q1 = `${cleanName} 부산 사업자등록번호`;
        const html = await searchDaum(q1);
        const bizMatches = html.match(/[0-9]{3}-[0-9]{2}-[0-9]{5}/g) || [];
        const validMatches = [...new Set(bizMatches)].filter(isValidBizNo);

        if (validMatches.length > 0) {
            console.log(`[Row ${u.rowNumber}] ${cleanName} found biz matches:`, validMatches);
        }
        await new Promise(r => setTimeout(r, 100));
    }
}

main().catch(console.error);
