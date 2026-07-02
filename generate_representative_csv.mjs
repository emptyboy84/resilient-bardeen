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

// 2. Read RAW map scraping results
const rawResults = fs.readFileSync('output_results.txt', 'utf-8').split('\n');

const excludeKeywords = ['은행', '새마을금고', 'CU ', 'GS25', '이마트24', '아파트', '노인정', '어린이집', '교회', '치킨', '피아노', '학원', '치과', '식당', '서점', '편의점', '출장소', '정문', '동문', '남문', '서문', '느태문', '경로당', '충전소', '대피소', '증권', '정류장', '물류센타', '부속의원', '오토바이', '렉카', '공부방', '미술', '수학교실', '투자', '자이안센터', '관리실', '관리사무소', '건강센터', '보증', '예비군', '치유', '복덕방', '스튜디오', '음악', '영어', '수학', '스포츠', '클럽', '카페', '커피', '펜션', '밥', '부엌', '전문점', '공인중개사', '행정사', '세무사'];

const dataMap = {}; // origComp -> { addr, options: [] }
let currentCompany = '';

for (const line of rawResults) {
    if (!line.trim()) continue;
    if (!line.startsWith('\t->')) {
        const parts = line.split('\t');
        currentCompany = parts[0];
        if (!dataMap[currentCompany]) {
            dataMap[currentCompany] = { addr: parts[1], options: [] };
        }
    } else {
        let text = line.replace('\t-> 대체발견: ', '').trim();
        if (text === '(검색된 제조업체 없음)') continue;
        
        let isExcluded = false;
        for (const kw of excludeKeywords) {
            if (text.includes(kw)) {
                isExcluded = true;
                break;
            }
        }
        if (!isExcluded) {
            dataMap[currentCompany].options.push(text);
        }
    }
}

const escapeCSV = (str) => {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

let csv = '\uFEFF'; 
csv += '작성자,비고,회사명,대표자,우편번호,주소,전화번호,변경 전화번호,팩스번호,홈페이지,이메일,사업자번호,법인번호,컨택결과,비고\n';

for (const origComp of Object.keys(dataMap)) {
    const item = dataMap[origComp];
    const zip = zipMap[origComp] || '';
    const addr = item.addr;
    
    // Pick the best representative option
    // 1. Must have a phone number
    // 2. Prioritize names that sound like manufacturing (공업, 산업, 테크, 정밀, 기업, 중공업, 엔지니어링)
    let bestOption = null;
    let fallbackOption = null; // one without phone number if no phone number exists
    
    const goodKeywords = ['공업', '산업', '테크', '정밀', '기업', '중공업', '엔지니어링', '스틸', '금속', '산기'];
    
    // Try to find one with a valid phone number
    const withPhone = item.options.filter(opt => !opt.includes('연락처: 없음') && !opt.includes('연락처: 없음'));
    
    if (withPhone.length > 0) {
        // Sort by presence of good keywords
        withPhone.sort((a, b) => {
            const aHas = goodKeywords.some(k => a.includes(k));
            const bHas = goodKeywords.some(k => b.includes(k));
            if (aHas && !bHas) return -1;
            if (!aHas && bHas) return 1;
            return 0;
        });
        bestOption = withPhone[0];
    } else if (item.options.length > 0) {
        // No option has a phone number, just pick the first one
        bestOption = item.options[0];
    }
    
    if (!bestOption) {
        const row = ['배현명', `기존: ${origComp}`, '(해당주소 대체업체 없음)', '', zip, addr, '', '', '', '', '', '', '', '', ''];
        csv += row.map(escapeCSV).join(',') + '\n';
    } else {
        const match = bestOption.match(/(.*) \(\) - 연락처: (.*)/);
        let newComp = bestOption;
        let newPhone = '';
        if (match) {
            newComp = match[1].trim();
            newPhone = match[2].trim() === '없음' ? '' : match[2].trim();
        } else {
            const s = bestOption.split(' - 연락처: ');
            if (s.length === 2) {
                newComp = s[0].replace(' ()', '').trim();
                newPhone = s[1].trim() === '없음' ? '' : s[1].trim();
            }
        }
        
        let remarks = `기존: ${origComp} 대체`;
        if (item.options.length > 1) {
            remarks += ` (외 ${item.options.length - 1}개 업체 생략)`;
        }
        
        const row = ['배현명', remarks, newComp, '', zip, addr, newPhone, '', '', '', '', '', '', '', ''];
        csv += row.map(escapeCSV).join(',') + '\n';
    }
}

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\scratch\\final_results_representative.csv', csv, 'utf-8');
console.log('Representative CSV generated.');
