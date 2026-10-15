const fs = require('fs');
const path = require('path');
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

function toCSVLine(cols) {
  return cols.map(col => {
    if (col === null || col === undefined) return '';
    const str = String(col);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

async function run() {
  const originalPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup.csv';
  const updatedPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const outputXlsx = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_16컬럼_주황색마킹_최종검증.xlsx';
  const outputHtml = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_16컬럼_주황색마킹_최종검증.html';

  console.log('Loading original backup and updated CSV...');
  const origLines = fs.readFileSync(originalPath, 'utf8').split(/\r?\n/);
  const updatedLines = fs.readFileSync(updatedPath, 'utf8').split(/\r?\n/);

  const header = parseCSVLine(origLines[0]);

  // Target columns in order for reporting and excel:
  // 1. 비고 (1)
  // 2. 회사명 (2)
  // 3. 사업자번호 (3)
  // 4. 대표자 (4)
  // 5. 우편번호 (5)
  // 6. 주소 (6)
  // 7. 전화번호 (7)
  // 8. 팩스번호 (8)
  // 9. 홈페이지 (9)
  // 10. 이메일 (10)
  // 11. 종업원수 (14)
  // 12. 업종(NICE BizINFO) (17)
  // 13. 법인번호 (24)
  // 14. 결산월 (30)
  // 15. 업종_대 (47)
  // 16. 업종_중 (48)
  // 17. 업종_소 (49)

  const colDefinitions = [
    { key: 'note', colIdx: 1, title: '비고', width: 12 },
    { key: 'company', colIdx: 2, title: '회사명', width: 25 },
    { key: 'bizNo', colIdx: 3, title: '사업자번호', width: 15 },
    { key: 'rep', colIdx: 4, title: '대표자', width: 12 },
    { key: 'zip', colIdx: 5, title: '우편번호', width: 10 },
    { key: 'addr', colIdx: 6, title: '주소', width: 45 },
    { key: 'phone', colIdx: 7, title: '전화번호', width: 16 },
    { key: 'fax', colIdx: 8, title: '팩스번호', width: 16 },
    { key: 'hp', colIdx: 9, title: '홈페이지', width: 25 },
    { key: 'email', colIdx: 10, title: '이메일', width: 22 },
    { key: 'emp', colIdx: 14, title: '종업원수', width: 12 },
    { key: 'nice', colIdx: 17, title: '업종(NICE BizINFO(업종)참고)', width: 30 },
    { key: 'corpNo', colIdx: 24, title: '법인번호', width: 18 },
    { key: 'closing', colIdx: 30, title: '결산월', width: 10 },
    { key: 'dae', colIdx: 47, title: '업종_대', width: 22 },
    { key: 'jung', colIdx: 48, title: '업종_중', width: 25 },
    { key: 'so', colIdx: 49, title: '업종_소', width: 30 }
  ];

  // Map of BHM rows
  const bhmRows = [];
  let seq = 0;

  let totalNewFills = 0;
  let totalModifications = 0;
  let totalClosed = 0;
  let totalRepChanges = 0;
  let totalAddrChanges = 0;

  for (let i = 1; i < updatedLines.length; i++) {
    if (!updatedLines[i].trim()) continue;
    const updCols = parseCSVLine(updatedLines[i]);
    if (updCols[0] === '배현명') {
      seq++;
      const origCols = i < origLines.length && origLines[i].trim() ? parseCSVLine(origLines[i]) : [];

      const lineNum = i + 1;
      const rowItem = {
        seq,
        lineNum,
        origCols,
        updCols,
        cells: []
      };

      if (updCols[1] === '폐업') totalClosed++;

      colDefinitions.forEach(col => {
        const origVal = (origCols[col.colIdx] || '').trim();
        const updVal = (updCols[col.colIdx] || '').trim();

        let isChanged = false;
        let changeType = 'none'; // 'new', 'modified', 'same'

        if (!origVal && updVal) {
          isChanged = true;
          changeType = 'new';
          totalNewFills++;
        } else if (origVal && updVal && origVal !== updVal) {
          isChanged = true;
          changeType = 'modified';
          totalModifications++;
          if (col.key === 'rep') totalRepChanges++;
          if (col.key === 'addr') totalAddrChanges++;
        }

        rowItem.cells.push({
          key: col.key,
          title: col.title,
          colIdx: col.colIdx,
          origVal,
          val: updVal,
          isChanged,
          changeType
        });
      });

      bhmRows.push(rowItem);
    }
  }

  console.log(`\n--- Verification & Change Summary (1,000 Rows) ---`);
  console.log(`Total 배현명 rows: ${bhmRows.length}`);
  console.log(`Newly populated cells (신규 입력): ${totalNewFills}건`);
  console.log(`Corrected/Modified cells (기존자료 검증 수정): ${totalModifications}건`);
  console.log(`  - Closed businesses verified (폐업 확인): ${totalClosed}건`);
  console.log(`  - Representative corrections (대표자 정정): ${totalRepChanges}건`);
  console.log(`  - Address relocations (주소 이전/보완): ${totalAddrChanges}건`);
  console.log(`Total Orange-highlighted cells: ${totalNewFills + totalModifications}개 셀`);

  // 1. Build Excel (.xlsx) with real Orange formatting using ExcelJS
  console.log('\nCreating ExcelJS workbook with Orange cell formatting...');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('배현명_검증완료');

  // Define Excel columns
  worksheet.columns = [
    { header: 'No', key: 'seq', width: 8 },
    { header: '원본행', key: 'lineNum', width: 10 },
    ...colDefinitions.map(c => ({ header: c.title, key: c.key, width: c.width }))
  ];

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell, colNum) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C3E50' }
    };
    cell.font = {
      name: '맑은 고딕',
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 11
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF34495E' } },
      left: { style: 'thin', color: { argb: 'FF34495E' } },
      bottom: { style: 'medium', color: { argb: 'FF1A252F' } },
      right: { style: 'thin', color: { argb: 'FF34495E' } }
    };
  });

  // Highlight NICE BizINFO header specifically
  const niceHeaderCell = headerRow.getCell(14); // NICE BizINFO column
  if (niceHeaderCell) {
    niceHeaderCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB3B' } // Bright yellow highlight
    };
    niceHeaderCell.font = {
      name: '맑은 고딕',
      bold: true,
      color: { argb: 'FF000000' },
      size: 11
    };
  }

  // Populate rows and apply Orange fill to modified/new cells
  bhmRows.forEach(rowItem => {
    const rowValues = {
      seq: rowItem.seq,
      lineNum: rowItem.lineNum
    };
    rowItem.cells.forEach(c => {
      rowValues[c.key] = c.val;
    });

    const excelRow = worksheet.addRow(rowValues);
    excelRow.height = 20;

    // Default row styling
    excelRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

    // Apply Orange fill to changed cells
    rowItem.cells.forEach((c, idx) => {
      const cell = excelRow.getCell(idx + 3); // 1:seq, 2:lineNum, 3+:data
      cell.font = { name: '맑은 고딕', size: 10 };
      cell.alignment = { vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
      };

      if (c.key === 'bizNo' || c.key === 'zip' || c.key === 'corpNo' || c.key === 'closing' || c.key === 'emp' || c.key === 'note') {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      if (c.isChanged) {
        // Orange highlight
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' } // Vivid Orange / Amber
        };
        cell.font = {
          name: '맑은 고딕',
          bold: true,
          color: { argb: 'FF803000' },
          size: 10
        };
      }

      // If closed, highlight note in red/pink
      if (c.key === 'note' && c.val === '폐업') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCDD2' }
        };
        cell.font = {
          name: '맑은 고딕',
          bold: true,
          color: { argb: 'FFB71C1C' },
          size: 10
        };
      }
    });
  });

  await workbook.xlsx.writeFile(outputXlsx);
  console.log(`Successfully generated Excel file: ${outputXlsx}`);

  // 2. Build HTML Preview with Orange Highlight
  console.log('\nCreating HTML preview with Orange cell styling...');
  let html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>배현명 실사 DB 16개 컬럼 최종 검증 (1,000건 주황색 하이라이트)</title>
<style>
  body { font-family: 'Pretendard', '맑은 고딕', sans-serif; margin: 20px; background-color: #f4f6f9; color: #222; }
  h1 { color: #1e3a8a; font-size: 20px; margin-bottom: 6px; }
  .summary-card { background: #fff; border-radius: 8px; padding: 18px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); font-size: 13px; line-height: 1.6; }
  .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 8px; }
  .badge-orange { background: #ffc000; color: #7a3e00; }
  .badge-closed { background: #ffcdd2; color: #b71c1c; }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .table-container { overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
  table { width: 100%; border-collapse: collapse; font-size: 11px; white-space: nowrap; }
  th { background: #1e293b; color: #fff; padding: 10px 8px; border: 1px solid #334155; position: sticky; top: 0; z-index: 10; text-align: center; }
  th.yellow-col { background: #eab308; color: #000; font-weight: bold; }
  td { padding: 6px 8px; border: 1px solid #e2e8f0; vertical-align: middle; }
  tr:hover { background-color: #f8fafc; }
  .orange-cell { background-color: #ffc000 !important; color: #6b3400; font-weight: bold; }
  .closed-cell { background-color: #fee2e2 !important; color: #991b1b; font-weight: bold; }
  .center { text-align: center; }
  .seq { background: #f1f5f9; text-align: center; font-weight: bold; color: #64748b; }
</style>
</head>
<body>
  <h1>배현명 실사 DB 16개 핵심 열 전수 검증본 (1,000행)</h1>
  <div class="summary-card">
    <div><strong>검증 완료 및 주황색 표시 기준:</strong></div>
    <div style="margin-top: 6px;">
      <span class="badge badge-orange">주황색 셀 (#FFC000)</span> <strong>신규 입력 및 기존 자료 검증 수정 (${totalNewFills + totalModifications}개 셀)</strong> &nbsp;|&nbsp;
      <span class="badge badge-closed">폐업 확인</span> <strong>국세청 기준 폐업 (${totalClosed}건)</strong> &nbsp;|&nbsp;
      <span class="badge badge-blue">대표자 정정</span> <strong>${totalRepChanges}건</strong> &nbsp;|&nbsp;
      <span class="badge badge-blue">주소 최신화</span> <strong>${totalAddrChanges}건</strong>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>원본행</th>
          <th>비고</th>
          <th>회사명</th>
          <th>사업자번호</th>
          <th>대표자</th>
          <th>우편번호</th>
          <th>주소</th>
          <th>전화번호</th>
          <th>팩스번호</th>
          <th>홈페이지</th>
          <th>이메일</th>
          <th>종업원수</th>
          <th class="yellow-col">업종(NICE BizINFO(업종)참고)</th>
          <th>법인번호</th>
          <th>결산월</th>
          <th>업종_대</th>
          <th>업종_중</th>
          <th>업종_소</th>
        </tr>
      </thead>
      <tbody>
`;

  bhmRows.forEach(r => {
    html += `        <tr>\n`;
    html += `          <td class="seq">${r.seq}</td>\n`;
    html += `          <td class="center">${r.lineNum}</td>\n`;
    r.cells.forEach(c => {
      let cls = '';
      if (c.key === 'bizNo' || c.key === 'zip' || c.key === 'corpNo' || c.key === 'closing' || c.key === 'emp' || c.key === 'note') {
        cls += 'center ';
      }
      if (c.key === 'note' && c.val === '폐업') {
        cls += 'closed-cell ';
      } else if (c.isChanged) {
        cls += 'orange-cell ';
      }
      html += `          <td class="${cls.trim()}">${c.val || ''}</td>\n`;
    });
    html += `        </tr>\n`;
  });

  html += `      </tbody>
    </table>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtml, html, 'utf8');
  console.log(`Successfully generated HTML preview: ${outputHtml}`);
}

run().catch(console.error);
