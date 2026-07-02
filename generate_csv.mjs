import fs from 'fs';

const rawInput = fs.readFileSync('input_data.txt', 'utf-8').trim().split('\n');
const zipMap = {};
for (const line of rawInput) {
    const parts = line.split('\t');
    if (parts.length >= 5) {
        const comp = parts[1].trim() || parts[0].trim();
        const zip = parts[3].trim();
        zipMap[comp] = zip;
    }
}

const rawResults = fs.readFileSync('final_filtered_results.txt', 'utf-8').trim().split('\n');

const escapeCSV = (str) => {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

// Add UTF-8 BOM so Excel natively understands the encoding
let csv = '\uFEFF'; 
csv += '작성자,비고,회사명,대표자,우편번호,주소,전화번호,변경 전화번호,팩스번호,홈페이지,이메일,사업자번호,법인번호,컨택결과,비고\n';

for (let i = 1; i < rawResults.length; i++) {
    const parts = rawResults[i].split('\t');
    if (parts.length < 3) continue;
    
    const origComp = parts[0];
    const addr = parts[1];
    const repsStr = parts[2];
    const zip = zipMap[origComp] || '';
    
    if (repsStr === '대체업체 없음') {
        const row = [
            '배현명', `기존: ${origComp}`, '(발견안됨)', '', zip, addr, '', '', '', '', '', '', '', '', ''
        ];
        csv += row.map(escapeCSV).join(',') + '\n';
    } else {
        const reps = repsStr.split(' / ');
        for (const rep of reps) {
            const match = rep.match(/(.*) \(\) - 연락처: (.*)/);
            let newComp = rep;
            let newPhone = '';
            if (match) {
                newComp = match[1].trim();
                newPhone = match[2].trim() === '없음' ? '' : match[2].trim();
            } else {
                const s = rep.split(' - 연락처: ');
                if (s.length === 2) {
                    newComp = s[0].replace(' ()', '').trim();
                    newPhone = s[1].trim() === '없음' ? '' : s[1].trim();
                }
            }
            const row = [
                '배현명', `기존: ${origComp} 대체`, newComp, '', zip, addr, newPhone, '', '', '', '', '', '', '', ''
            ];
            csv += row.map(escapeCSV).join(',') + '\n';
        }
    }
}

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\scratch\\final_results.csv', csv, 'utf-8');
console.log('CSV generated.');
