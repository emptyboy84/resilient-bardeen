const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

const moreVerified = [
    {
        rowNumber: 2256,
        name: '저스티스어드벤처',
        bizno: '177-81-00390',
        matchedTitle: '(주) 저스티스어드벤처',
        matchedCeo: '정원일',
        matchedAddress: '부산광역시 해운대구 센텀중앙로 97, 센텀스카이비즈 B동 603호 (재송동)',
        status: '계속사업자',
        sourceUrl: 'https://bizno.net/article/1778100390 및 네이버 플레이스 사업자 등록정보',
        matchedVia: 'Naver+Bizno'
    },
    {
        rowNumber: 2259,
        name: '번들즈',
        bizno: '876-87-02750',
        matchedTitle: '주식회사 번들즈',
        matchedCeo: '김민수',
        matchedAddress: '부산광역시 해운대구 센텀중앙로 97, 센텀스카이비즈 A동 804-1호 (재송동)',
        status: '계속사업자',
        sourceUrl: '국세청 홈택스 및 네이버 기업정보(876-87-02750)',
        matchedVia: 'Naver+Hometax'
    },
    {
        rowNumber: 2307,
        name: '피커스튜디오',
        bizno: '606-16-43962',
        matchedTitle: '피커스튜디오',
        matchedCeo: '이현철',
        matchedAddress: '부산 연제구 월드컵대로114번길 26 (연산동)',
        status: '계속사업자',
        sourceUrl: '부산정보산업진흥원 게임사업단 등록정보 및 네이버 플레이스(606-16-43962)',
        matchedVia: 'Naver+BIPA'
    },
    {
        rowNumber: 750,
        name: '불교방송',
        bizno: '604-82-04181',
        matchedTitle: '(재)부산불교방송',
        matchedCeo: '박형수/공원배',
        matchedAddress: '부산광역시 동구 범일로 102 (범일동, BBS부산불교방송사옥)',
        status: '계속사업자',
        sourceUrl: 'https://bizno.net/article/6048204181 및 방송통신위원회 방송사업자등록',
        matchedVia: 'Bizno+KCC'
    }
];

moreVerified.forEach(v => {
    results[String(v.rowNumber)] = v;
    console.log(`Added Row ${v.rowNumber} "${v.name}" => ${v.bizno}`);
});

fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');
const totalMatched = Object.values(results).filter(r => r.bizno !== null).length;
console.log('Total verified companies now:', totalMatched);
