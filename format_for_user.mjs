import fs from 'fs';

// 1. Read input data to get zipcodes
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

// 2. Read final results
const rawResults = fs.readFileSync('final_filtered_results.txt', 'utf-8').trim().split('\n');

let md = '# 스크래핑 결과 요약 (사용자 양식 맞춤표)\n\n';
md += '요청하신 엑셀 틀(`작성자 | 비고 | 회사명 | 대표자 | 우편번호 | 주소 | 전화번호 | ...`)에 맞춰 표를 다시 그렸습니다. 아래 표를 전체 선택해서 엑셀에 그대로 붙여넣기 하시면 됩니다.\n\n';

md += '| 작성자 | 비고 | 회사명 | 대표자 | 우편번호 | 주소 | 전화번호 | 변경 전화번호 | 팩스번호 | 홈페이지 | 이메일 | 사업자번호 | 법인번호 | 컨택결과 | 비고 |\n';
md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';

for (let i = 1; i < rawResults.length; i++) {
    const parts = rawResults[i].split('\t');
    if (parts.length < 3) continue;
    
    const origComp = parts[0];
    const addr = parts[1];
    const repsStr = parts[2];
    const zip = zipMap[origComp] || '';
    
    if (repsStr === '대체업체 없음') {
        md += `| 배현명 | 기존: ${origComp} | (발견안됨) | | ${zip} | ${addr} | | | | | | | | | |\n`;
    } else {
        const reps = repsStr.split(' / ');
        for (const rep of reps) {
            // rep: "회사명 () - 연락처: 000-0000"
            const match = rep.match(/(.*) \(\) - 연락처: (.*)/);
            let newComp = rep;
            let newPhone = '';
            if (match) {
                newComp = match[1].trim();
                newPhone = match[2].trim() === '없음' ? '' : match[2].trim();
            } else {
                // just in case
                const s = rep.split(' - 연락처: ');
                if (s.length === 2) {
                    newComp = s[0].replace(' ()', '').trim();
                    newPhone = s[1].trim() === '없음' ? '' : s[1].trim();
                }
            }
            md += `| 배현명 | 기존: ${origComp} 대체 | **${newComp}** | | ${zip} | ${addr} | ${newPhone} | | | | | | | | |\n`;
        }
    }
}

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\walkthrough.md', md, 'utf-8');
console.log('Done!');
