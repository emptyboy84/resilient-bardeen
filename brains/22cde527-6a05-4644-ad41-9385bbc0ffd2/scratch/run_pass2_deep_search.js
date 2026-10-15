const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const missingFile = path.join(SCRATCH_DIR, 'missing_421.json');
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');

const missing = JSON.parse(fs.readFileSync(missingFile, 'utf8'));
const missingMap = {};
missing.forEach(m => { missingMap[String(m.rowNumber)] = m; });

// Checksum
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
    return addr.includes('부산');
}

function ceoMatches(targetCeo, candidateCeo) {
    if (!targetCeo || targetCeo.trim().length === 0) return true;
    if (!candidateCeo || candidateCeo.trim().length === 0) return false;

    const tList = targetCeo.split(/[,/]/).map(s => s.trim().replace(/\s/g, '')).filter(s => s.length > 0);
    const c = candidateCeo.replace(/[\s]/g, '');

    for (const t of tList) {
        if (c === t) return true;
        if (c.endsWith('*') && c.length > 1) {
            const prefix = c.replace(/\*/g, '');
            if (prefix.length >= 2 && t.startsWith(prefix)) return true;
        }
        if (c.length === 3 && c[1] === '*' && t.length === 3 && c[0] === t[0] && c[2] === t[2]) return true;
    }
    return false;
}

// Check title similarity strictly
function titlesMatch(target, candidate) {
    const t = cleanCompanyName(target);
    const c = cleanCompanyName(candidate);
    if (!t || !c) return false;
    if (t === c) return true;

    // Substring only if long enough and high ratio
    const minL = Math.min(t.length, c.length);
    const maxL = Math.max(t.length, c.length);
    if (minL >= 3 && (c.includes(t) || t.includes(c)) && (minL / maxL >= 0.75)) {
        return true;
    }
    return false;
}

async function fetchBiznoDetail(biznoDigits) {
    try {
        const url = `https://bizno.net/article/${biznoDigits}`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) return null;
        const html = await res.text();
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : '';
        if (title.includes('|')) title = title.split('|')[0].trim();
        if (title.includes('-')) title = title.split('-')[0].trim();
        if (!title || title.length < 2) return null;

        let ceo = '';
        const ceoM = text.match(/대표자명\s*:\s*([^\s]+)/);
        if (ceoM) ceo = ceoM[1].trim();

        let addr = '';
        const addrM = text.match(/회사주소\s*:\s*([^"]+?)(?=\s*\(우|\s*대표자|\s*사업자등록번호|\s*종업원수|\s*설립일|\s*$)/);
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

async function deepInvestigate(item) {
    const cleanTarget = cleanCompanyName(item.name);
    if (!cleanTarget || cleanTarget.length < 2) return null;
    const district = extractBusanDistrict(item.address);

    // 1. Bizno Search
    try {
        const bUrl = 'https://bizno.net/?query=' + encodeURIComponent(cleanTarget);
        const bRes = await fetch(bUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            signal: AbortSignal.timeout(3500)
        });
        if (bRes.ok) {
            const bHtml = await bRes.text();
            const linkRegex = /<a\s+href="\/article\/([0-9]{10})"[^>]*>([\s\S]*?)<\/a>/gi;
            let lm;
            const candidateIds = [];
            while ((lm = linkRegex.exec(bHtml)) !== null) {
                const bId = lm[1];
                const rawTitle = lm[2].replace(/<[^>]+>/g, '').trim();
                if (titlesMatch(item.name, rawTitle)) {
                    candidateIds.push(bId);
                }
            }

            for (const bId of candidateIds.slice(0, 4)) {
                if (!isValidBizNo(bId)) continue;
                const detail = await fetchBiznoDetail(bId);
                if (detail && isBusanAddress(detail.address)) {
                    if (titlesMatch(item.name, detail.title)) {
                        if (district && !detail.address.includes(district)) {
                            if (!item.ceo || !ceoMatches(item.ceo, detail.ceo)) continue;
                        }
                        if (item.ceo && !ceoMatches(item.ceo, detail.ceo)) continue;

                        detail.matchedVia = 'Pass2_BiznoDeep';
                        return detail;
                    }
                }
            }
        }
    } catch (e) {}

    // 2. Naver Search
    try {
        let q = `${item.name} 부산`;
        if (district) q += ` ${district}`;
        if (item.ceo) q += ` ${item.ceo}`;
        q += ' 사업자등록번호';

        const nUrl = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURIComponent(q);
        const nRes = await fetch(nUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            signal: AbortSignal.timeout(3500)
        });
        if (nRes.ok) {
            const nHtml = await nRes.text();
            const bMatches = nHtml.match(/\b\d{3}-\d{2}-\d{5}\b/g);
            if (bMatches) {
                const unique = [...new Set(bMatches)];
                for (const b of unique.slice(0, 3)) {
                    if (!isValidBizNo(b)) continue;
                    const digits = b.replace(/[^0-9]/g, '');
                    const detail = await fetchBiznoDetail(digits);
                    if (detail && isBusanAddress(detail.address)) {
                        if (titlesMatch(item.name, detail.title)) {
                            if (district && !detail.address.includes(district)) {
                                if (!item.ceo || !ceoMatches(item.ceo, detail.ceo)) continue;
                            }
                            if (item.ceo && !ceoMatches(item.ceo, detail.ceo)) continue;
                            detail.matchedVia = 'Pass2_NaverDeep';
                            return detail;
                        }
                    }
                }
            }
        }
    } catch (e) {}

    return null;
}

async function runPass2() {
    console.log('=== Starting Concurrent PASS 2 Deep Grounding ===');
    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

    // Remove false positive from Row 547 if it existed
    if (results['547'] && results['547'].bizno === '617-15-99417') {
        results['547'] = { rowNumber: 547, name: '냉이영화', bizno: null, reason: 'False positive pruned' };
    }

    const unverifiedKeys = Object.keys(results).filter(k => results[k].bizno === null);
    console.log(`Analyzing ${unverifiedKeys.length} unverified records with Concurrency 6...`);

    let newlyMatched = 0;
    const CONCURRENCY = 6;

    for (let i = 0; i < unverifiedKeys.length; i += CONCURRENCY) {
        const batchKeys = unverifiedKeys.slice(i, i + CONCURRENCY);
        const promises = batchKeys.map(async (key) => {
            const item = missingMap[key];
            if (!item) return;

            const match = await deepInvestigate(item);
            if (match) {
                console.log(`  🎉 [Row ${item.rowNumber}] "${item.name}" => ${match.bizno} (${match.title}) [${match.address}]`);
                results[key] = {
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
                newlyMatched++;
            }
        });

        await Promise.all(promises);
        console.log(`Progress: ${Math.min(i + CONCURRENCY, unverifiedKeys.length)} / ${unverifiedKeys.length} (Recovered: ${newlyMatched})`);
        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n=== PASS 2 FINISHED ===`);
    console.log(`Newly recovered in Pass 2: ${newlyMatched}`);
    const totalMatched = Object.values(results).filter(r => r.bizno !== null).length;
    console.log(`Total verified business numbers: ${totalMatched} / 421`);
}

runPass2();
