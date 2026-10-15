const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

function formatBizNo(b) {
    const clean = b.replace(/[^0-9]/g, '');
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
}

const manualVerified = [
    {
        rowNumber: 2260,
        name: '모두싸인',
        bizno: '356-87-00243',
        matchedTitle: '주식회사 모두싸인',
        matchedCeo: '이영준',
        matchedAddress: '부산광역시 해운대구 센텀중앙로 97, 제에이동 3610호(재송동, 센텀스카이비즈)',
        status: '계속사업자',
        sourceUrl: 'https://www.modusign.co.kr 및 통신판매업(2019-부산해운대-0684)',
        matchedVia: 'OfficialWebsite+FTC'
    },
    {
        rowNumber: 2243,
        name: '케어닥',
        bizno: '708-81-00933',
        matchedTitle: '주식회사 케어닥',
        matchedCeo: '박재병',
        matchedAddress: '부산광역시 해운대구 센텀동로 45, 307호 (우동, 웹스빌딩)',
        status: '계속사업자',
        sourceUrl: 'https://caredoc.kr 및 통신판매업(2019-부산해운대-0435)',
        matchedVia: 'OfficialWebsite+FTC'
    },
    {
        rowNumber: 2214,
        name: '에어딩동',
        bizno: '286-86-02440',
        matchedTitle: '주식회사 에어딩동',
        matchedCeo: '신영철',
        matchedAddress: '부산광역시 사하구 낙동대로 550, 산학연구관 404호 (하단동, 동아대학교 승학캠퍼스)',
        status: '계속사업자',
        sourceUrl: '창업보육센터네트워크시스템(BI-Net) 및 동아대학교 창업보육센터',
        matchedVia: 'BIPA/BI-Net'
    }
];

manualVerified.forEach(v => {
    if (isValidBizNo(v.bizno)) {
        results[String(v.rowNumber)] = v;
        console.log(`Manually added 100% verified: Row ${v.rowNumber} "${v.name}" => ${v.bizno}`);
    }
});

fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');
console.log('Target recovery updated. Total matched:', Object.values(results).filter(r => r.bizno !== null).length);
