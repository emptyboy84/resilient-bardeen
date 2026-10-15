const fs = require('fs');
const path = require('path');
const https = require('https');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const list = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'filled_companies_summary.json'), 'utf8'));

console.log('Total companies to fetch details for:', list.length);

function fetchUrl(url) {
    return new Promise(resolve => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            },
            timeout: 7000
        }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve(d));
        }).on('error', () => resolve('')).on('timeout', function() { this.destroy(); resolve(''); });
    });
}

function parseBiznoHtml(html) {
    if (!html) return {};
    const info = {};

    // 1. Meta description parsing
    const metaM = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (metaM) {
        const text = metaM[1];
        const getField = (label) => {
            const reg = new RegExp(label + '\\s*:\\s*([^:]+?)(?=\\s+[가-힣A-Za-z0-9_()\\/]+?\\s*:|$)', 'i');
            const m = reg.exec(text);
            return m ? m[1].trim() : '';
        };

        const regDate = getField('설립일\\(신고\\/인허가일\\)');
        if (regDate) {
            info.regDate = regDate;
            const ym = regDate.match(/([0-9]{4})-([0-9]{2})/);
            if (ym) {
                info.year = ym[1];
                info.month = String(parseInt(ym[2], 10));
            }
        }

        const tel = getField('전화번호');
        if (tel && !tel.includes('***')) info.tel = tel;

        const fax = getField('팩스번호');
        if (fax && !fax.includes('***')) info.fax = fax;

        const emp = getField('종업원수');
        if (emp) {
            const empNum = emp.replace(/[^0-9]/g, '');
            if (empNum) info.employees = empNum;
        }

        const status = getField('사업자 현재 상태\\(※국세청 홈택스 실시간 정보제공\\)');
        if (status) info.status = status;

        const ceo = getField('대표자명');
        if (ceo && !ceo.includes('*')) info.ceo = ceo;

        const addr = getField('회사주소');
        if (addr) info.address = addr;
    }

    // 2. Table fallback for closed date
    const closeM = html.match(/폐업일\s*:\s*([0-9]{4})[-.]?([0-9]{2})[-.]?([0-9]{2})/);
    if (closeM) {
        info.closeDate = `${closeM[1]}-${closeM[2]}-${closeM[3]}`;
        info.isClosed = true;
    } else {
        const closeM2 = html.match(/폐업일\s*:\s*([0-9]{8})/);
        if (closeM2) {
            const s = closeM2[1];
            info.closeDate = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
            info.isClosed = true;
        }
    }

    // Table fallback for 등록일
    if (!info.year) {
        const tableRegM = html.match(/<th>등록일<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
        if (tableRegM) {
            const clean = tableRegM[1].replace(/<[^>]+>/g, '').trim();
            const ym = clean.match(/([0-9]{4})-([0-9]{2})/);
            if (ym) {
                info.year = ym[1];
                info.month = String(parseInt(ym[2], 10));
            }
        }
    }

    // Table fallback for 종업원수
    if (!info.employees) {
        const tableEmpM = html.match(/<th>종업원수<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
        if (tableEmpM) {
            const clean = tableEmpM[1].replace(/<[^>]+>/g, '').trim();
            const num = clean.replace(/[^0-9]/g, '');
            if (num) info.employees = num;
        }
    }

    return info;
}

async function main() {
    const detailsCache = {};
    const batchSize = 10;

    for (let i = 0; i < list.length; i += batchSize) {
        const batch = list.slice(i, i + batchSize);
        await Promise.all(batch.map(async item => {
            if (!item.bizno) return;
            const digits = item.bizno.replace(/[^0-9]/g, '');
            const url = `https://bizno.net/article/${digits}`;
            try {
                const html = await fetchUrl(url);
                const info = parseBiznoHtml(html);
                detailsCache[String(item.rowNumber)] = info;
            } catch(e) {
                console.error(`Error fetching row ${item.rowNumber}:`, e.message);
            }
        }));
        console.log(`Fetched ${Math.min(i + batchSize, list.length)} / ${list.length}...`);
        await new Promise(r => setTimeout(r, 200));
    }

    fs.writeFileSync(path.join(SCRATCH_DIR, 'details_cache_150.json'), JSON.stringify(detailsCache, null, 2), 'utf8');
    console.log('Saved details_cache_150.json successfully!');
}

main().catch(console.error);
