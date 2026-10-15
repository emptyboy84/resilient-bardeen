const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const missingFile = path.join(SCRATCH_DIR, 'missing_421.json');
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');

const missing = JSON.parse(fs.readFileSync(missingFile, 'utf8'));

// 국세청 사업자등록번호 10자리 체크섬
function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
        sum += Number(clean[i]) * weights[i];
    }
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

function formatBizNo(b) {
    const clean = b.replace(/[^0-9]/g, '');
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
}

function cleanCompanyName(name) {
    if (!name) return '';
    return name.replace(/\(주\)|주식회사|㈜|\(유\)|유한회사|\(재\)|재단법인|\(사\)|사단법인/g, '')
               .replace(/[\s\-_.,\(\)\[\]]/g, '')
               .toLowerCase();
}

function extractBusanDistrict(address) {
    if (!address) return '';
    const m = address.match(/(해운대구|부산진구|동래구|남구|북구|사상구|사하구|금정구|연제구|수영구|중구|동구|서구|영도구|강서구|기장군)/);
    return m ? m[1] : '';
}

function isBusanAddress(addr) {
    if (!addr) return false;
    const nonBusan = /전남|광주|대구|인천|대전|울산|경기|강원|충북|충남|전북|경북|경남|제주|서울/;
    if (addr.includes('부산')) return true;
    if (extractBusanDistrict(addr) && !nonBusan.test(addr)) return true;
    return false;
}

// Strict CEO match
function ceoMatches(targetCeo, candidateCeo) {
    if (!targetCeo || targetCeo.trim().length === 0) return true; // No target CEO specified in CSV
    if (!candidateCeo || candidateCeo.trim().length === 0) return false; // Target has CEO, candidate has none

    const tList = targetCeo.split(/[,/]/).map(s => s.trim().replace(/\s/g, '')).filter(s => s.length > 0);
    const c = candidateCeo.replace(/[\s]/g, '');

    for (const t of tList) {
        if (c === t) return true;
        // Masked: e.g. t = "최장수", c = "최장*"
        if (c.endsWith('*') && c.length > 1) {
            const prefix = c.replace(/\*/g, '');
            if (prefix.length >= 2 && t.startsWith(prefix)) return true;
        }
        // Masked middle: e.g. t = "최장수", c = "최*수"
        if (c.length === 3 && c[1] === '*' && t.length === 3 && c[0] === t[0] && c[2] === t[2]) return true;
    }
    return false;
}

// Fetch Bizno article details
async function fetchBiznoDetail(biznoDigits) {
    try {
        const url = `https://bizno.net/article/${biznoDigits}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        const html = await res.text();
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

        // Title from <title> tag
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : '';
        if (title.includes('|')) title = title.split('|')[0].trim();
        if (title.includes('-')) title = title.split('-')[0].trim();

        if (!title || title.length < 2) return null;

        let ceo = '';
        const ceoM = text.match(/대표자명\s*:\s*([^\s]+)/);
        if (ceoM) ceo = ceoM[1].trim();

        let addr = '';
        const addrM = text.match(/주소\s*:\s*([^"]+?)(?=\s*\(우|\s*대표자|\s*사업자등록번호|\s*종업원수|\s*설립일|\s*$)/);
        if (addrM) addr = addrM[1].trim();

        let status = '';
        const statM = text.match(/사업자\s*현재\s*상태[^\:]*:\s*([^\s]+)/);
        if (statM) status = statM[1].trim();

        return {
            bizno: formatBizNo(biznoDigits),
            title,
            ceo,
            address: addr,
            status,
            sourceUrl: url
        };
    } catch (e) {
        return null;
    }
}

// 1. Search Bizno
async function searchBizno(name, targetDistrict, targetCeo) {
    const q = cleanCompanyName(name);
    if (!q || q.length < 2) return null;

    try {
        const url = 'https://bizno.net/?query=' + encodeURIComponent(q);
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!res.ok) return null;
        const html = await res.text();

        const candidates = [];
        const linkRegex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a\s+href="\/article|\n\s*<div class="footer|\$)/gi;
        let lm;
        while ((lm = linkRegex.exec(html)) !== null) {
            const rawBiz = lm[1];
            const itemTitle = lm[2].replace(/<[^>]+>/g, '').trim();
            const snippet = lm[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (snippet.includes('adsbygoogle') || snippet.includes('실시간 조회기업')) {
                const cutIdx = snippet.search(/adsbygoogle|실시간 조회기업/);
                candidates.push({ bizno: rawBiz, title: itemTitle, snippet: snippet.slice(0, cutIdx) });
                break;
            }
            candidates.push({ bizno: rawBiz, title: itemTitle, snippet });
        }

        const cleanTarget = cleanCompanyName(name);
        for (const c of candidates) {
            if (!isValidBizNo(c.bizno)) continue;
            const cName = cleanCompanyName(c.title);
            if (!cName || cName.length < 2) continue;

            const isNameEqual = (cName === cleanTarget);
            const isSub = (cName.includes(cleanTarget) || cleanTarget.includes(cName));
            if (!isNameEqual && !isSub) continue;
            if (!isNameEqual) {
                const minLen = Math.min(cName.length, cleanTarget.length);
                const maxLen = Math.max(cName.length, cleanTarget.length);
                if (minLen / maxLen < 0.6) continue;
            }

            const isBusan = isBusanAddress(c.snippet);
            const isDist = targetDistrict && c.snippet.includes(targetDistrict);

            if (isBusan || isDist) {
                const full = await fetchBiznoDetail(c.bizno);
                if (full && isBusanAddress(full.address)) {
                    if (targetDistrict && !full.address.includes(targetDistrict)) {
                        if (!targetCeo || !ceoMatches(targetCeo, full.ceo)) continue;
                    }
                    if (targetCeo && !ceoMatches(targetCeo, full.ceo)) continue;
                    return full;
                }
            }
        }
    } catch (e) {}
    return null;
}

// 2. Search Naver
async function searchNaver(name, targetDistrict, targetCeo) {
    const cleanTarget = cleanCompanyName(name);
    if (!cleanTarget || cleanTarget.length < 2) return null;

    try {
        let q = `${name} 부산`;
        if (targetDistrict) q += ` ${targetDistrict}`;
        if (targetCeo) q += ` ${targetCeo}`;
        q += ' 사업자등록번호';

        const url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURIComponent(q);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        const html = await res.text();

        const bizMatches = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        if (!bizMatches) return null;

        const unique = [...new Set(bizMatches)];
        for (const b of unique) {
            if (!isValidBizNo(b)) continue;
            const digits = b.replace(/[^0-9]/g, '');

            const full = await fetchBiznoDetail(digits);
            if (!full || !full.title || full.title.length < 2) continue;
            if (!isBusanAddress(full.address)) continue;

            const cName = cleanCompanyName(full.title);
            const isNameEqual = (cName === cleanTarget);
            const isSub = (cName.includes(cleanTarget) || cleanTarget.includes(cName));
            if (!isNameEqual && !isSub) continue;
            if (!isNameEqual) {
                const minLen = Math.min(cName.length, cleanTarget.length);
                const maxLen = Math.max(cName.length, cleanTarget.length);
                if (minLen / maxLen < 0.6) continue;
            }

            if (targetDistrict && !full.address.includes(targetDistrict)) {
                if (!targetCeo || !ceoMatches(targetCeo, full.ceo)) continue;
            }
            if (targetCeo && !ceoMatches(targetCeo, full.ceo)) continue;

            full.matchedVia = 'NaverSearch+BiznoDetail';
            return full;
        }
    } catch (e) {}
    return null;
}

// 3. Search DuckDuckGo (Global Index)
async function searchDDG(name, targetDistrict, targetCeo) {
    const cleanTarget = cleanCompanyName(name);
    if (!cleanTarget || cleanTarget.length < 2) return null;

    try {
        let q = `"${name}" 부산`;
        if (targetDistrict) q += ` "${targetDistrict}"`;
        if (targetCeo) q += ` "${targetCeo}"`;
        q += ' 사업자등록번호';

        const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        const html = await res.text();

        const bizMatches = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        if (!bizMatches) return null;

        const unique = [...new Set(bizMatches)];
        for (const b of unique) {
            if (!isValidBizNo(b)) continue;
            const digits = b.replace(/[^0-9]/g, '');

            const full = await fetchBiznoDetail(digits);
            if (!full || !full.title || full.title.length < 2) continue;
            if (!isBusanAddress(full.address)) continue;

            const cName = cleanCompanyName(full.title);
            const isNameEqual = (cName === cleanTarget);
            const isSub = (cName.includes(cleanTarget) || cleanTarget.includes(cName));
            if (!isNameEqual && !isSub) continue;
            if (!isNameEqual) {
                const minLen = Math.min(cName.length, cleanTarget.length);
                const maxLen = Math.max(cName.length, cleanTarget.length);
                if (minLen / maxLen < 0.6) continue;
            }

            if (targetDistrict && !full.address.includes(targetDistrict)) {
                if (!targetCeo || !ceoMatches(targetCeo, full.ceo)) continue;
            }
            if (targetCeo && !ceoMatches(targetCeo, full.ceo)) continue;

            full.matchedVia = 'DDG+BiznoDetail';
            return full;
        }
    } catch (e) {}
    return null;
}

async function run() {
    console.log(`Starting STRICT Pass 1 verification for ${missing.length} records...`);
    const progress = {};
    let matchedCount = 0;
    let unverifiableCount = 0;

    for (let i = 0; i < missing.length; i++) {
        const item = missing[i];
        const key = String(item.rowNumber);
        const district = extractBusanDistrict(item.address);

        console.log(`[${i + 1}/${missing.length}] Row ${item.rowNumber} | "${item.name}" | 대표: "${item.ceo}" | 구: "${district}"`);

        // 1. Bizno
        let match = await searchBizno(item.name, district, item.ceo);
        if (match) match.matchedVia = 'BiznoSearch';

        // 2. Naver
        if (!match) {
            match = await searchNaver(item.name, district, item.ceo);
        }

        // 3. DDG
        if (!match) {
            match = await searchDDG(item.name, district, item.ceo);
        }

        if (match) {
            console.log(`  => MATCH CONFIRMED: ${match.bizno} (${match.title}) | 주소: "${match.address}" | 대표: "${match.ceo}" [${match.status}]`);
            progress[key] = {
                rowNumber: item.rowNumber,
                name: item.name,
                bizno: match.bizno,
                matchedTitle: match.title,
                matchedCeo: match.ceo,
                matchedAddress: match.address,
                status: match.status,
                sourceUrl: match.sourceUrl,
                matchedVia: match.matchedVia
            };
            matchedCount++;
        } else {
            console.log(`  => UNVERIFIED / PENDING PASS 2`);
            progress[key] = {
                rowNumber: item.rowNumber,
                name: item.name,
                bizno: null,
                reason: '미등록 또는 식별 불명'
            };
            unverifiableCount++;
        }

        // Save progress every 10 items
        if ((i + 1) % 10 === 0 || i === missing.length - 1) {
            fs.writeFileSync(resultsFile, JSON.stringify(progress, null, 2), 'utf8');
            console.log(`  >>> Progress Saved: ${i + 1}/${missing.length} | Matched: ${matchedCount} | Unverifiable: ${unverifiableCount} <<<`);
        }

        await new Promise(r => setTimeout(r, 120));
    }

    console.log('\n================ PASS 1 COMPLETED ================');
    console.log(`Total: ${missing.length}, Matched: ${matchedCount}, Unverifiable: ${unverifiableCount}`);
}

run();
