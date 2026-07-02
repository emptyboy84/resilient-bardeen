import fs from 'fs';

async function fetchKakaoMap(address) {
    const url = `https://search.map.kakao.com/mapsearch/map.daum?callback=jQuery&q=${encodeURIComponent(address)}&msFlag=A&sort=0`;
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://map.kakao.com/'
            }
        });
        const body = await response.text();
        const match = body.match(/jQuery\((.*)\)/);
        if (match) {
            const data = JSON.parse(match[1]);
            return data.place || [];
        }
    } catch (e) {
        console.error(`Error fetching ${address}:`, e.message);
    }
    return [];
}

async function main() {
    const lines = fs.readFileSync('input_data.txt', 'utf-8').trim().split('\n');
    let output = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split('\t');
        if (parts.length < 5) continue;

        const originalComp = parts[1].trim() || parts[0].trim();
        const rawAddr = parts[4].trim();

        // Remove things in parenthesis like (장평동) and split by comma
        const cleanAddr = rawAddr.replace(/\(.*?\)/g, '').split(',')[0].trim();

        const places = await fetchKakaoMap(cleanAddr);
        await new Promise(r => setTimeout(r, 500)); // sleep

        let found = [];
        for (const p of places) {
            const cat = p.cateName || '';
            const name = p.name || '';
            const tel = p.tel || '';
            
            const isMfg = cat.includes('제조') || cat.includes('공업') || cat.includes('산업') || 
                          cat.includes('테크') || cat.includes('정밀') || cat.includes('정공') || 
                          cat.includes('플랜트') || cat.includes('엔지니어링');
            const nameIsMfg = ['공장', '제조', '정공', '테크', '산업', '기계', '엔지니어링', '이엔지', '플랜트'].some(kw => name.includes(kw));

            if (isMfg || nameIsMfg || (!name.includes('비지나우') && !name.includes('결번'))) {
                found.push(`${name} (${cat}) - 연락처: ${tel || '없음'}`);
            }
        }

        let res = `${originalComp}\t${rawAddr}\n`;
        if (found.length > 0) {
            for (const fm of found) {
                res += `\t-> 대체발견: ${fm}\n`;
            }
        } else {
            res += `\t-> 대체발견: (검색된 제조업체 없음)\n`;
        }
        output.push(res);
        
        console.log(`Processed [${i + 1}/${lines.length}] ${originalComp} -> ${found.length} found.`);
    }

    fs.writeFileSync('output_results.txt', output.join('\n'));
    console.log("Finished! Results saved to output_results.txt.");
}

main();
