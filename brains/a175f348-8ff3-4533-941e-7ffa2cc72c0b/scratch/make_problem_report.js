const fs = require('fs');
const ExcelJS = require('c:/Users/lg/resilient-bardeen/node_modules/exceljs');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const bhmRows = [];
let seq = 0;
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    seq++;
    bhmRows.push({ seq, lineNum: i + 1, cols });
  }
}

const problemRows = [];

bhmRows.forEach(r => {
  const note = (r.cols[1] || '').trim();
  const company = (r.cols[2] || '').trim();
  const bizNo = (r.cols[3] || '').trim();
  const rep = (r.cols[4] || '').trim();
  const zip = (r.cols[5] || '').trim();
  const addr = (r.cols[6] || '').trim();
  const phone = (r.cols[7] || '').trim();
  const fax = (r.cols[8] || '').trim();
  const hp = (r.cols[9] || '').trim();
  const email = (r.cols[10] || '').trim();
  const emp = (r.cols[14] || '').trim();
  const nice = (r.cols[17] || '').trim();
  const corpNo = (r.cols[24] || '').trim();
  const closing = (r.cols[30] || '').trim();
  const dae = (r.cols[47] || '').trim();
  const jung = (r.cols[48] || '').trim();
  const so = (r.cols[49] || '').trim();

  let category = '';
  let detailReason = '';
  let actionGuide = '';

  if (bizNo === '3071222209' || bizNo === '6424100108' || bizNo === '6611101191' || !addr) {
    category = '1. 사업자번호오류/주소결측';
    detailReason = '사업자등록번호 불일치 또는 공시 주소 부재';
    actionGuide = '국세청 홈택스 수동 재검색 또는 담당자 확인 필요';
  } else if (note === '폐업') {
    category = '2. 폐업(실사제외)';
    detailReason = '국세청 홈택스 실시간 기준 폐업 확인';
    actionGuide = '통화 불필요 (실사 대상에서 제외 처리)';
  } else if (!phone) {
    category = '3. 전화번호 부재(가동중)';
    detailReason = '정상 가동 기업이나 공시 유선/무선 번호 미등록';
    actionGuide = '네이버 지도/현장 실사 또는 홈페이지/이메일 문의';
  } else if (!rep) {
    category = '4. 대표자명 누락';
    detailReason = '대표자명 미공시';
    actionGuide = '통화 시 대표자 확인 필요';
  }

  if (category) {
    problemRows.push({
      seq: r.seq,
      lineNum: r.lineNum,
      category,
      company,
      bizNo,
      rep,
      phone,
      zip,
      addr,
      hp,
      email,
      nice,
      detailReason,
      actionGuide
    });
  }
});

console.log(`Total problem items: ${problemRows.length}`);

// Generate Problem Report Excel
async function makeReport() {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('문제항목_구체적상세');

  ws.columns = [
    { header: 'No', key: 'seq', width: 8 },
    { header: '원본행', key: 'lineNum', width: 10 },
    { header: '문제분류', key: 'category', width: 24 },
    { header: '회사명', key: 'company', width: 25 },
    { header: '사업자번호', key: 'bizNo', width: 15 },
    { header: '대표자', key: 'rep', width: 12 },
    { header: '전화번호', key: 'phone', width: 16 },
    { header: '주소', key: 'addr', width: 45 },
    { header: '홈페이지', key: 'hp', width: 25 },
    { header: '업종(NICE)', key: 'nice', width: 28 },
    { header: '구체적 원인', key: 'detailReason', width: 35 },
    { header: '실사 대응 가이드', key: 'actionGuide', width: 35 }
  ];

  const headerRow = ws.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.font = { name: '맑은 고딕', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  problemRows.forEach(p => {
    const row = ws.addRow(p);
    row.height = 20;

    const catCell = row.getCell(3);
    if (p.category.includes('폐업')) {
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
      row.getCell(3).font = { name: '맑은 고딕', bold: true, color: { argb: 'FFB71C1C' } };
    } else if (p.category.includes('오류')) {
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE082' } };
      row.getCell(3).font = { name: '맑은 고딕', bold: true, color: { argb: 'FFC62828' } };
    } else if (p.category.includes('전화번호')) {
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0B2' } };
      row.getCell(3).font = { name: '맑은 고딕', bold: true, color: { argb: 'FFE65100' } };
    }
  });

  const outExcel = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_문제항목_구체적상세리포트.xlsx';
  await workbook.xlsx.writeFile(outExcel);
  console.log(`Saved Excel: ${outExcel}`);
}

makeReport();
