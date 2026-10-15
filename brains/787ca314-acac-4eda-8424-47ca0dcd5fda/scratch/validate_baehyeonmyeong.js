const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_corp_reg_number/node_modules/exceljs');

const targetFilePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx';

function getBizType(bizno) {
  if (!bizno) return 'UNKNOWN';
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length < 5) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  if (mid === '83') return '국가/지자체';
  if (mid === '84') return '외국법인';
  if (mid === '80') return '법인아닌단체/개인';
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

async function main() {
  console.log('Loading workbook...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetFilePath);
  const sheet = wb.getWorksheet('기업 정보');

  const headerRow = sheet.getRow(1);
  const headers = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = cell.value ? String(cell.value).trim() : '';
  });

  console.log('Total rows in sheet:', sheet.rowCount);
  
  let authorCol = 1;
  let compCol = 3;
  let bizCol = 4;
  let corpCol = 25; // default fallback

  for (let i = 1; i < headers.length; i++) {
    if (headers[i] === '작성자') authorCol = i;
    if (headers[i] === '회사명') compCol = i;
    if (headers[i] === '사업자번호' && !bizCol) bizCol = i;
    if (headers[i] === '법인번호') corpCol = i;
  }
  console.log(`Column Mapping: 작성자=${authorCol} (${headers[authorCol]}), 회사명=${compCol} (${headers[compCol]}), 사업자번호=${bizCol} (${headers[bizCol]}), 법인번호=${corpCol} (${headers[corpCol]})`);

  const results = [];
  const allAuthors = new Set();

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const authorVal = row.getCell(authorCol).value;
    const author = authorVal ? String(authorVal).trim() : '';
    if (author) allAuthors.add(author);

    if (author === '배현명') {
      const company = row.getCell(compCol).value ? String(row.getCell(compCol).value).trim() : '';
      const biznoRaw = row.getCell(bizCol).value ? String(row.getCell(bizCol).value).trim() : '';
      const corpNoRaw = row.getCell(corpCol).value ? String(row.getCell(corpCol).value).trim() : '';
      const note = row.getCell(2).value ? String(row.getCell(2).value).trim() : '';

      const bizType = getBizType(biznoRaw);
      const isCorpEntity = ['영리법인본점', '영리법인지점', '비영리법인', '외국법인'].includes(bizType) ||
        company.includes('(주)') || company.includes('주식회사') || company.includes('㈜') || company.includes('(유)') || company.includes('유한회사');
      
      const hasCorp = !!corpNoRaw && corpNoRaw.length > 0;
      const validChecksum = isValidCorpNo(corpNoRaw);

      results.push({
        rowNumber,
        author,
        note,
        company,
        bizno: biznoRaw,
        corpNo: corpNoRaw,
        bizType,
        isCorpEntity,
        hasCorp,
        validChecksum
      });
    }
  });

  console.log('All Authors in sheet:', Array.from(allAuthors));
  console.log(`Found ${results.length} rows for '배현명'.`);

  // Analyze issues
  const missingCorp = results.filter(r => r.isCorpEntity && !r.hasCorp);
  const individualWithCorp = results.filter(r => !r.isCorpEntity && r.hasCorp);
  const invalidChecksum = results.filter(r => r.hasCorp && !r.validChecksum);
  const validCorp = results.filter(r => r.hasCorp && r.validChecksum);
  const individualNoCorp = results.filter(r => !r.isCorpEntity && !r.hasCorp);

  console.log('\n--- [배현명 데이터 분석 요약] ---');
  console.log(`총 행 수: ${results.length}`);
  console.log(`법인번호 정상(체크섬 통과): ${validCorp.length}`);
  console.log(`개인사업자(법인번호 없음, 정상): ${individualNoCorp.length}`);
  console.log(`법인 추정이나 법인번호 누락(빈값): ${missingCorp.length}`);
  console.log(`개인사업자인데 법인번호 기재(오류 의심): ${individualWithCorp.length}`);
  console.log(`기재된 법인번호 체크섬 불일치: ${invalidChecksum.length}`);

  const report = {
    totalRows: results.length,
    validCorpCount: validCorp.length,
    individualNoCorpCount: individualNoCorp.length,
    missingCorp,
    individualWithCorp,
    invalidChecksum,
    validCorp,
    allRows: results
  };

  const outputPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_corp_reg_number/bae_validation_report.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log('\nReport written to ' + outputPath);
}

main().catch(console.error);
