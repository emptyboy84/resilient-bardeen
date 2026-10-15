const fs = require('fs');
const res = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch\\verified_results.json', 'utf8'));

const suspects = [];
for (const k of Object.keys(res)) {
    const item = res[k];
    if (!item.bizno) continue;
    const addr = (item.matchedAddress || '').trim();
    // Must start with 부산 or contain 부산광역시 or 부산시
    const isRealBusan = addr.startsWith('부산') || addr.includes('부산광역시') || addr.includes('부산시');
    if (!isRealBusan) {
        suspects.push({ key: k, name: item.name, bizno: item.bizno, address: addr });
    }
}

console.log(`Found ${suspects.length} suspect addresses:`);
suspects.forEach(s => {
    console.log(`Row ${s.key} | "${s.name}" (${s.bizno}) => "${s.address}"`);
});
