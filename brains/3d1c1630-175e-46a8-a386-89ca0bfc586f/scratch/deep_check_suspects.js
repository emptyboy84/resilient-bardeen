const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

function analyzeCorpNoDetail(corpNo) {
  if (!corpNo) return { valid: false, reason: 'EMPTY' };
  const clean = String(corpNo).replace(/[^0-9]/g, '');
  if (clean.length !== 13) return { valid: false, reason: `LENGTH_${clean.length}` };
  
  const courtCode = clean.substring(0, 4);
  const entityKind = clean.substring(4, 6);
  const serial = clean.substring(6, 12);
  const checkDigit = Number(clean[12]);

  // Modulo 10 algorithm
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const calcCheck = (10 - remainder) % 10;
  const mod10Match = (checkDigit === calcCheck);

  return {
    clean,
    formatted: `${clean.substring(0, 6)}-${clean.substring(6)}`,
    courtCode,
    entityKind,
    serial,
    checkDigit,
    calcCheck,
    mod10Match
  };
}

async function deepCheck() {
  const targetPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetPath);
  const ws = wb.getWorksheet('기업 정보');

  // Let's inspect the rows that were flagged earlier
  const suspectRows = [
    704, 1874, 2415, 2417, 2462, 3343, 5012, 5044, 5060, 5076, 5097, 5121, 5151, 5219, 5237, 5280,
    11881, 11955, 12288, 12318
  ];

  console.log('=== 의심 행 정밀 심층 분석 ===');
  suspectRows.forEach(r => {
    const row = ws.getRow(r);
    const company = row.getCell(3).value;
    const bizno = row.getCell(4).value;
    const corpNo = row.getCell(25).value;
    const rep = row.getCell(5).value;
    const addr = row.getCell(7).value;
    const nice = row.getCell(18).value;
    const corpDetail = analyzeCorpNoDetail(corpNo);

    console.log(`[행 ${r}] ${company} | 사업자: ${bizno} | 대표자: ${rep}`);
    console.log(`  주소: ${addr}`);
    console.log(`  법인번호: ${corpNo} -> 분석:`, JSON.stringify(corpDetail));
  });
}

deepCheck().catch(err => console.error(err));
