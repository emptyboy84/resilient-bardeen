const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

function getBizType(bizno) {
  if (!bizno) return 'UNKNOWN';
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  if (mid === '33') return '사내근로복지기금/단체';
  return '기타';
}

function isValidCorpNo(corpNo) {
  if (!corpNo) return false;
  const clean = String(corpNo).replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[12]) === checkDigit;
}

function isValidBizNo(bizno) {
  if (!bizno) return false;
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  sum += Math.floor((Number(clean[8]) * 5) / 10);
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[9]) === checkDigit;
}

async function auditBaeRows() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');

  const rows = [];
  for (let r = 2; r <= 12347; r++) {
    const row = ws.getRow(r);
    const assignee = row.getCell(1).value;
    if (assignee && String(assignee).includes('배현명')) {
      const getVal = (col) => {
        const v = row.getCell(col).value;
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') {
          if (v.text) return String(v.text).trim();
          if (v.result) return String(v.result).trim();
        }
        return String(v).trim();
      };

      const getFill = (col) => {
        const fill = row.getCell(col).fill;
        if (!fill) return false;
        if (fill.type === 'pattern' && fill.pattern === 'solid') {
          const color = fill.fgColor ? (fill.fgColor.argb || fill.fgColor.theme) : null;
          return color;
        }
        return false;
      };

      const rowObj = {
        rowNum: r,
        assignee: getVal(1),
        status: getVal(2),             // 비고(폐업/휴업/등등)
        company: getVal(3),            // 회사명
        biznoCol4: getVal(4),          // 사업자번호 (기본정보)
        rep: getVal(5),                // 대표자
        zip: getVal(6),                // 우편번호
        address: getVal(7),            // 주소
        phone: getVal(8),              // 전화번호
        fax: getVal(9),                // 팩스번호
        homepage: getVal(10),          // 홈페이지
        email: getVal(11),             // 이메일
        empCount: getVal(15),          // 종업원수 (col 15)
        bizTypeNice: getVal(18),       // 업종(NICE BizINFO) (col 18)
        biznoCol24: getVal(24),        // 사업자번호 (재무/법인정보) (col 24)
        corpNo: getVal(25),            // 법인번호 (col 25)
        settleMonth: getVal(31),       // 결산월 (col 31)
        bizLarge: getVal(48),          // 업종_대 (col 48)
        bizMid: getVal(49),            // 업종_중 (col 49)
        bizSmall: getVal(50),          // 업종_소 (col 50)
        respName: getVal(53),          // 응답자명
        respPhone: getVal(56),         // 응답자연락처
        fillCol3: getFill(3),
        fillCol18: getFill(18),
        fillCol25: getFill(25),
      };
      rows.push(rowObj);
    }
  }

  console.log(`Total 배현명 rows extracted: ${rows.length}`);

  // Split into 702-5500 (1000 rows) and 11847-12346 (500 rows)
  const rows1000 = rows.filter(r => r.rowNum < 11847);
  const rows500 = rows.filter(r => r.rowNum >= 11847);

  console.log(`Rows 1000 count: ${rows1000.length} (Row ${rows1000[0]?.rowNum} ~ ${rows1000[rows1000.length - 1]?.rowNum})`);
  console.log(`Rows 500 count: ${rows500.length} (Row ${rows500[0]?.rowNum} ~ ${rows500[rows500.length - 1]?.rowNum})`);

  // Analyze each set
  function analyzeSet(name, set) {
    console.log(`\n================== [${name}] (${set.length} rows) ==================`);
    
    // Status distribution
    const statusDist = {};
    set.forEach(r => {
      const st = r.status || '(정상/공란)';
      statusDist[st] = (statusDist[st] || 0) + 1;
    });
    console.log('상태(비고) 분포:', JSON.stringify(statusDist, null, 2));

    // Bizno check
    const invalidBizNo = set.filter(r => {
      const b = r.biznoCol4 || r.biznoCol24;
      return !isValidBizNo(b);
    });
    console.log('사업자번호 체크섬 오류 건수:', invalidBizNo.length);

    // 개인 vs 법인
    let indivCount = 0;
    let corpCount = 0;
    let indivWithCorpNo = [];
    let corpWithoutCorpNo = [];
    let corpInvalidChecksum = [];

    set.forEach(r => {
      const b = r.biznoCol4 || r.biznoCol24;
      const bType = getBizType(b);
      const isCorpName = r.company.includes('(주)') || r.company.includes('주식회사') || r.company.includes('㈜');
      const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bType) || isCorpName;

      if (isCorp) {
        corpCount++;
        if (!r.corpNo) {
          corpWithoutCorpNo.push(r);
        } else if (!isValidCorpNo(r.corpNo)) {
          corpInvalidChecksum.push(r);
        }
      } else {
        indivCount++;
        if (r.corpNo) {
          indivWithCorpNo.push(r);
        }
      }
    });

    console.log(`개인사업자: ${indivCount}건, 법인사업자: ${corpCount}건`);
    console.log(`개인사업자인데 법인번호 기재된 건: ${indivWithCorpNo.length}건`);
    if (indivWithCorpNo.length > 0) {
      console.log('  -> 목록:', indivWithCorpNo.map(r => `행 ${r.rowNum}: ${r.company} (${r.biznoCol4 || r.biznoCol24}, 법인번호: ${r.corpNo})`));
    }
    console.log(`법인사업자인데 법인번호 누락된 건: ${corpWithoutCorpNo.length}건`);
    if (corpWithoutCorpNo.length > 0 && corpWithoutCorpNo.length <= 10) {
      console.log('  -> 목록:', corpWithoutCorpNo.map(r => `행 ${r.rowNum}: ${r.company} (${r.biznoCol4 || r.biznoCol24})`));
    }
    console.log(`법인번호 체크섬 불일치 건: ${corpInvalidChecksum.length}건`);
    if (corpInvalidChecksum.length > 0) {
      console.log('  -> 목록:', corpInvalidChecksum.map(r => `행 ${r.rowNum}: ${r.company} (${r.corpNo})`));
    }

    // Phone format check
    const phoneCount = set.filter(r => !!r.phone).length;
    const repPhoneCount = set.filter(r => !!r.respPhone).length;
    console.log(`전화번호(col 8) 기재: ${phoneCount}건, 응답자연락처(col 56) 기재: ${repPhoneCount}건`);

    // Zip and Address check
    const missingZip = set.filter(r => !r.zip);
    const missingAddr = set.filter(r => !r.address);
    console.log(`우편번호 누락: ${missingZip.length}건, 주소 누락: ${missingAddr.length}건`);
    if (missingZip.length > 0 && missingZip.length <= 10) {
      console.log('  -> 우편번호 누락 샘플:', missingZip.map(r => `행 ${r.rowNum}: ${r.company}`));
    }

    // Industry categories check
    const missingBizType = set.filter(r => !r.bizTypeNice);
    const missingLarge = set.filter(r => !r.bizLarge);
    const missingMid = set.filter(r => !r.bizMid);
    const missingSmall = set.filter(r => !r.bizSmall);
    console.log(`업종(NICE) 누락: ${missingBizType.length}건, 대분류 누락: ${missingLarge.length}건, 중분류 누락: ${missingMid.length}건, 소분류 누락: ${missingSmall.length}건`);

    // Homepage & Email check
    const hpCount = set.filter(r => !!r.homepage).length;
    const emailCount = set.filter(r => !!r.email).length;
    console.log(`홈페이지 기재: ${hpCount}건, 이메일 기재: ${emailCount}건`);

    // Check cell fill colors (orange fill)
    let fillCount = 0;
    set.forEach(r => {
      if (r.fillCol3 || r.fillCol18 || r.fillCol25) fillCount++;
    });
    console.log(`주황색 마킹된 행 수: ${fillCount}건`);
  }

  analyzeSet('1차 구간: 702~5500행 (1,000건)', rows1000);
  analyzeSet('2차 구간: 11847~12346행 (500건)', rows500);
}

auditBaeRows().catch(err => console.error(err));
