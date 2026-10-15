const fs = require('fs');

const parsed = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', 'utf8')).slice(0, 58);

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
  if ((mid >= 1 && mid <= 79) || (mid >= 90 && mid <= 99)) return '개인사업자';
  if (mid === 81 || mid === 86 || mid === 87 || mid === 88) return '영리법인(본점)';
  if (mid === 85) return '영리법인(지점)';
  if (mid === 82) return '비영리법인';
  if (mid === 83) return '국가/지자체';
  if (mid === 84) return '외국법인 본/지점';
  return '기타';
}

const auditResults = [];

parsed.forEach((r, idx) => {
  const bizType = getBizType(r.bizNo);
  const cleanCorp = (r.corpNo || '').replace(/[^0-9]/g, '');
  const cleanBiz = (r.bizNo || '').replace(/[^0-9]/g, '');
  
  const report = {
    row: idx + 1,
    name: r.name,
    bizNo: r.bizNo,
    bizType: bizType,
    status: r.status,
    corpNo: r.corpNo,
    colsCount: r.colsCount,
    errors: [],
    warnings: [],
    notes: []
  };

  // 1. 컬럼 개수
  if (r.colsCount !== 18) {
    report.errors.push(`열 수 불일치 (${r.colsCount}열/18열)`);
  }

  // 2. 사업자번호
  if (cleanBiz.length !== 10) {
    report.errors.push(`사업자번호 자리수 이상 (${cleanBiz.length}자리)`);
  }

  // 3. 법인번호 검증
  if (r.corpNo) {
    if (bizType === '개인사업자') {
      report.errors.push(`[치명적] 개인사업자인데 법인번호가 기재됨 (${r.corpNo})`);
    } else {
      if (cleanCorp.length === 10) {
        report.errors.push(`[치명적] 법인번호 열에 사업자등록번호(${r.corpNo})가 잘못 입력됨`);
      } else if (cleanCorp.length !== 13) {
        report.errors.push(`법인번호 자리수 오류 (${cleanCorp.length}자리)`);
      } else {
        const isValid = validateChecksum(cleanCorp);
        if (!isValid) {
          report.errors.push(`법인번호 체크섬 불일치 (가중치 검증 실패: ${r.corpNo})`);
        } else {
          report.notes.push(`법인번호 13자리 체크섬 검증 정상 통과`);
        }
      }
    }
  } else {
    // 법인번호가 없는 경우
    if (bizType === '개인사업자') {
      report.notes.push(`개인사업자로 법인번호 없음(정상)`);
    } else if (bizType === '영리법인(지점)') {
      report.warnings.push(`영리법인 지점 - 법인번호 미기재 (본점 법인번호 필요 여부 확인)`);
    } else if (bizType === '영리법인(본점)') {
      report.warnings.push(`영리법인 본점이나 법인번호 공란`);
    }
  }

  // 4. 상태 및 비고 확인
  if (r.status) {
    report.notes.push(`상태/비고: ${r.status}`);
  }

  // 5. 기타 대표자, 주소 등 주요 필드 결측치
  if (!r.ceo) report.warnings.push('대표자명 공란');
  if (!r.addr) report.warnings.push('주소 공란');
  if (!r.bizDetail) report.warnings.push('업종 세부 공란');

  auditResults.push(report);
});

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\detailed_audit.json', JSON.stringify(auditResults, null, 2), 'utf8');

console.log('=== AUDIT SUMMARY ===');
console.log(`Total Rows Checked: ${auditResults.length}`);
const errorRows = auditResults.filter(r => r.errors.length > 0);
console.log(`Rows with Errors: ${errorRows.length}`);
errorRows.forEach(r => {
  console.log(`[Row ${r.row}] ${r.name} (${r.bizNo}): ${r.errors.join(' | ')}`);
});

const warningRows = auditResults.filter(r => r.warnings.length > 0 && r.errors.length === 0);
console.log(`\nRows with Warnings only: ${warningRows.length}`);
warningRows.forEach(r => {
  console.log(`[Row ${r.row}] ${r.name} (${r.bizNo}): ${r.warnings.join(' | ')}`);
});
