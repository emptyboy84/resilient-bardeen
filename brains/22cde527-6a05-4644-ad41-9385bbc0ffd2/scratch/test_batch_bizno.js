const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch\\missing_421.json', 'utf8'));

// Checksum verification
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

// Clean company name for search
function cleanName(name) {
    return name.replace(/\(주\)|주식회사|㈜|\(유\)|유한회사/g, '').trim();
}

async function searchBizno(name) {
    const q = cleanName(name);
    const url = 'https://bizno.net/?query=' + encodeURIComponent(q);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();

    const results = [];
    const linkRegex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a\s+href="\/article|\n\s*<div class="footer|\$)/gi;
    let lm;
    while ((lm = linkRegex.exec(html)) !== null) {
        const rawBiz = lm[1];
        const title = lm[2].replace(/<[^>]+>/g, '').trim();
        const snippet = lm[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Exclude footer / adsbygoogle / unrelated items
        if (snippet.includes('adsbygoogle') || snippet.includes('실시간 조회기업')) {
            const cutIdx = snippet.search(/adsbygoogle|실시간 조회기업/);
            const cleanSnippet = cutIdx !== -1 ? snippet.slice(0, cutIdx) : snippet;
            results.push({ bizno: rawBiz, title, snippet: cleanSnippet });
            break; // after adsbygoogle, subsequent items are unrelated footer links
        }
        results.push({ bizno: rawBiz, title, snippet });
    }
    return results;
}

async function run() {
    const testSet = missing.slice(0, 30);
    console.log(`Testing first ${testSet.length} companies...`);

    const matches = [];
    for (let i = 0; i < testSet.length; i++) {
        const item = testSet[i];
        try {
            const results = await searchBizno(item.name);
            // Filter results: must match company name (or clean name)
            const cleanTarget = cleanName(item.name).toLowerCase();
            
            // Find candidate that matches name AND (address contains 부산 or 구 or representative matches)
            const candidates = results.filter(r => {
                const rTitle = cleanName(r.title).toLowerCase();
                const nameMatches = rTitle === cleanTarget || rTitle.includes(cleanTarget) || cleanTarget.includes(rTitle);
                return nameMatches;
            });

            console.log(`\n[${i+1}/${testSet.length}] Row ${item.rowNumber} | "${item.name}" (대표: "${item.ceo}", 주소: "${item.address}")`);
            console.log(`   -> Found ${results.length} total, ${candidates.length} name-matches`);
            
            let best = null;
            for (const c of candidates) {
                // Check address & ceo match
                const isBusan = c.snippet.includes('부산') || (item.address && item.address.split(' ')[0] && c.snippet.includes(item.address.split(' ')[0]));
                const ceoMatch = item.ceo && c.snippet.includes(item.ceo[0]);
                const validChecksum = isValidBizNo(c.bizno);
                
                console.log(`      Candidate: ${c.bizno} (${c.title}) | Busan: ${isBusan} | ValidChecksum: ${validChecksum} | Snippet: ${c.snippet.slice(0, 80)}`);
                if (validChecksum && (isBusan || ceoMatch)) {
                    best = c;
                    break;
                }
            }
            if (best) {
                console.log(`   => MATCHED: ${formatBizNo(best.bizno)} for ${item.name}`);
                matches.push({ rowNumber: item.rowNumber, name: item.name, bizno: formatBizNo(best.bizno) });
            } else {
                console.log(`   => NO DEFINITIVE MATCH`);
            }
        } catch (e) {
            console.log(`   => Error:`, e.message);
        }
        // slight delay to be respectful
        await new Promise(r => setTimeout(r, 100));
    }
    console.log(`\nMatched ${matches.length} out of ${testSet.length}`);
}

run();
