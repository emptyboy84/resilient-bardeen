import fs from 'fs';

const raw = fs.readFileSync('output_results.txt', 'utf-8');
const lines = raw.split('\n');

let currentCompany = '';
let currentAddress = '';
let finalData = [];
let currentReplacements = [];

const excludeKeywords = ['은행', '새마을금고', 'CU ', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터'];

for (const line of lines) {
    if (!line.startsWith('\t->')) {
        if (currentCompany) {
            finalData.push({ comp: currentCompany, addr: currentAddress, reps: currentReplacements });
        }
        const parts = line.split('\t');
        currentCompany = parts[0];
        currentAddress = parts[1];
        currentReplacements = [];
    } else {
        const text = line.replace('\t-> 대체발견: ', '').trim();
        if (text === '(검색된 제조업체 없음)') continue;
        
        // 필터링 적용
        let isExcluded = false;
        for (const kw of excludeKeywords) {
            if (text.includes(kw)) {
                isExcluded = true;
                break;
            }
        }
        if (!isExcluded) {
            currentReplacements.push(text);
        }
    }
}
if (currentCompany) {
    finalData.push({ comp: currentCompany, addr: currentAddress, reps: currentReplacements });
}

let resultTxt = '기존 업체명\t주소지\t발견된 대체 제조업체 (연락처)\n';
for (const row of finalData) {
    if (!row.comp) continue;
    let repsStr = row.reps.join(' / ');
    if (!repsStr) repsStr = '대체업체 없음';
    resultTxt += `${row.comp}\t${row.addr}\t${repsStr}\n`;
}

fs.writeFileSync('final_filtered_results.txt', resultTxt);
console.log('Filtered data saved to final_filtered_results.txt');
