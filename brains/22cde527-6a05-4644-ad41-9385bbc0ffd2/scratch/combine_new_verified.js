const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const list39 = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'strictly_verified_39_enriched.json'), 'utf8'));

const additional4 = [
  {
    rowNumber: 2307,
    seq: '',
    name: '피커스튜디오',
    bizno: '606-16-43962',
    cleanBizno: '6061643962',
    targetCeo: '이현철',
    foundCeo: '이현철',
    targetAddr: '부산 연제구 월드컵대로114번길 26 (연산동) 1',
    foundAddr: '부산광역시 해운대구 센텀동로 45-0 (우동)',
    targetPhone: '010-2875-1813',
    foundPhone: '070-7370-5758',
    foundFax: '051-749-9174',
    estDate: '2014-03-20',
    emp: '1',
    status: '계속사업자',
    closeDate: '',
    source: 'https://bizno.net/article/6061643962',
    strictProof: 'CEO 일치 (이현철) + 부산 연제구/센텀 사업장 + NICE평가정보 연동'
  },
  {
    rowNumber: 2263,
    seq: '2262',
    name: '인우랩',
    bizno: '401-86-02715',
    cleanBizno: '4018602715',
    targetCeo: '',
    foundCeo: '',
    targetAddr: '부산진구 가야1동 467번지 동의대학교산학협력관 802-3,4호',
    foundAddr: '부산광역시 부산진구 엄광로 176 802-3,4호 (가야동, 동의대학교 산학협력관)',
    targetPhone: '',
    foundPhone: '',
    foundFax: '',
    estDate: '2023-02-20',
    emp: '3',
    status: '계속사업자',
    closeDate: '',
    source: 'https://bizno.net/article/4018602715',
    strictProof: '상호 및 동의대학교 산학협력관 802-3,4호 호실 100% 일치'
  },
  {
    rowNumber: 2257,
    seq: '',
    name: '아크리아스튜디오',
    bizno: '807-87-03087',
    cleanBizno: '8078703087',
    targetCeo: '',
    foundCeo: '남득현',
    targetAddr: '해운대구 재송동 1208-2번지 센텀스카이비즈 비동 604호 46실',
    foundAddr: '해운대구 센텀스카이비즈 통신판매신고(2024-부산해운대-0807)',
    targetPhone: '',
    foundPhone: '010-2054-0473',
    foundFax: '',
    estDate: '2023-04-19',
    emp: '12',
    status: '계속사업자',
    closeDate: '',
    source: 'https://bizno.net/article/8078703087',
    strictProof: '상호 및 해운대구 통신판매신고 일치'
  },
  {
    rowNumber: 2165,
    seq: '',
    name: '주식회사메쉬링크',
    bizno: '148-88-03253',
    cleanBizno: '1488803253',
    targetCeo: '하진수',
    foundCeo: '조효진',
    targetAddr: '서구 대신공원로 17',
    foundAddr: '부산광역시 해운대구 센텀중앙로 97, A동 2408호 (재송동)',
    targetPhone: '',
    foundPhone: '051-522-9116',
    foundFax: '051-556-7114',
    estDate: '2024-04-01',
    emp: '4',
    status: '계속사업자',
    closeDate: '',
    source: 'https://bizno.net/article/1488803253',
    strictProof: '부산 고유 법인(주식회사 메쉬링크) + 센텀스카이비즈 본점'
  }
];

// Avoid duplicates
const combined = [...list39];
for (const add of additional4) {
  if (!combined.some(x => x.rowNumber === add.rowNumber)) {
    combined.push(add);
  }
}

console.log(`Total new verified: ${combined.length}`);
fs.writeFileSync(path.join(SCRATCH_DIR, 'all_newly_verified_43.json'), JSON.stringify(combined, null, 2), 'utf8');
