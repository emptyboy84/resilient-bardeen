const fs = require('fs');

const raw = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\last_user_input.txt', 'utf8');

// remove XML tags and "검수!!"
const lines = raw.split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('<') && !l.startsWith('검수!!'));

console.log('Total extracted data rows:', lines.length);

// Column schema (18 columns expected):
// 0: 작성자 (배현명)
// 1: 상태/비고 (폐업 등)
// 2: 상호/회사명
// 3: 사업자등록번호
// 4: 대표자명
// 5: 우편번호
// 6: 주소
// 7: 전화번호
// 8: 팩스번호
// 9: 홈페이지
// 10: 이메일
// 11: 종업원수
// 12: 업종 (세부)
// 13: 법인등록번호
// 14: 결산월
// 15: 업종_대
// 16: 업종_중
// 17: 업종_소

function validateChecksum(corpNo) {
  const clean = (corpNo || '').replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean[i], 10) * weights[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clean[12], 10);
}

function getBizType(bizNo) {
  const clean = (bizNo || '').replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = parseInt(clean.substring(3, 5), 10);
  if ((mid >= 1 && mid <= 79) || (mid >= 90 && mid <= 99)) return '개인';
  if (mid === 81 || mid === 86 || mid === 87 || mid === 88) return '영리법인 본점';
  if (mid === 85) return '영리법인 지점';
  if (mid === 82) return '비영리법인';
  if (mid === 83) return '국가/지자체';
  if (mid === 84) return '외국법인 본/지점';
  return '기타';
}

const parsed = lines.map((line, idx) => {
  const cols = line.split('\t');
  return {
    rowIdx: idx + 1,
    rawLine: line,
    colsCount: cols.length,
    cols: cols,
    author: cols[0],
    status: cols[1],
    name: cols[2],
    bizNo: cols[3],
    ceo: cols[4],
    zip: cols[5],
    addr: cols[6],
    tel: cols[7],
    fax: cols[8],
    home: cols[9],
    email: cols[10],
    empCount: cols[11],
    bizDetail: cols[12],
    corpNo: cols[13],
    closingMonth: cols[14],
    bizLarge: cols[15],
    bizMid: cols[16],
    bizSmall: cols[17]
  };
});

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', JSON.stringify(parsed, null, 2), 'utf8');
console.log('Saved parsed rows to parsed_input.json');

// Run initial checks
parsed.forEach(r => {
  const bizType = getBizType(r.bizNo);
  const issues = [];
  
  if (r.colsCount !== 18) {
    issues.push(`열 개수 불일치(${r.colsCount}/18)`);
  }
  
  const cleanBiz = (r.bizNo || '').replace(/[^0-9]/g, '');
  if (cleanBiz.length !== 10) {
    issues.push(`사업자번호 자리수 이상(${cleanBiz.length})`);
  }
  
  if (r.corpNo) {
    const cleanCorp = r.corpNo.replace(/[^0-9]/g, '');
    if (bizType === '개인') {
      issues.push(`개인사업자에 법인번호 기재됨(${r.corpNo})`);
    } else {
      if (cleanCorp.length === 10) {
        issues.push(`법인번호 칸에 사업자번호로 추정되는 10자리 입력됨(${r.corpNo})`);
      } else if (cleanCorp.length !== 13) {
        issues.push(`법인번호 자리수 오류(${cleanCorp.length}자리)`);
      } else if (!validateChecksum(cleanCorp)) {
        issues.push(`법인번호 체크섬 불일치(${r.corpNo})`);
      }
    }
  } else {
    if (bizType.startsWith('영리법인') && bizType !== '영리법인 지점') {
      issues.push(`영리법인인데 법인번호 공란`);
    }
  }

  if (issues.length > 0) {
    console.log(`[Row ${r.rowIdx}] ${r.name} (${r.bizNo}, ${bizType}): ${issues.join(' | ')}`);
  }
});
