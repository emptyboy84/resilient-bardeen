const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const todayDir = 'C:/Users/lg/Desktop/Today';

async function scanExistingFiles() {
  console.log('--- Inspecting Today Directory Files ---');
  
  // 1. Check bizno file
  const biznoPath = path.join(todayDir, '비즈노_500개_기업정보_16개열_정제완료.xlsx');
  if (fs.existsSync(biznoPath)) {
    const wb = new xlsx.Workbook();
    await wb.xlsx.readFile(biznoPath);
    console.log(`[비즈노_500개_기업정보]: ${wb.worksheets[0].name}, rowCount: ${wb.worksheets[0].rowCount}`);
    const row1 = wb.worksheets[0].getRow(1).values;
    console.log(`  Headers:`, row1);
    const row2 = wb.worksheets[0].getRow(2).values;
    console.log(`  Sample row 2:`, row2);
  }

  // 2. Check naver/kakao phone report
  const phoneReportPath = path.join(todayDir, '배현명_실사DB_네이버지도_카카오맵_전화번호검증리포트.csv');
  if (fs.existsSync(phoneReportPath)) {
    const content = fs.readFileSync(phoneReportPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    console.log(`[네이버지도_카카오맵_전화번호검증리포트]: lines: ${lines.length}`);
    console.log(`  Header:`, lines[0]);
    console.log(`  Sample 1:`, lines[1]);
  }

  // 3. Check 200 corps nice check
  const nice200Path = path.join(todayDir, '배현명_실사DB_200개기업_18컬럼_작성자포함_최신.csv');
  if (fs.existsSync(nice200Path)) {
    const content = fs.readFileSync(nice200Path, 'utf8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    console.log(`[200개기업_18컬럼_최신]: lines: ${lines.length}`);
    console.log(`  Header:`, lines[0]);
    console.log(`  Sample 1:`, lines[1]);
  }

  // 4. Check CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx
  const blueReportPath = path.join(todayDir, 'CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx');
  if (fs.existsSync(blueReportPath)) {
    const wb = new xlsx.Workbook();
    await wb.xlsx.readFile(blueReportPath);
    console.log(`[CT실태조사_파란색기업_정밀실사]: ${wb.worksheets[0].name}, rowCount: ${wb.worksheets[0].rowCount}`);
    const row1 = wb.worksheets[0].getRow(1).values;
    console.log(`  Headers:`, row1);
    const row2 = wb.worksheets[0].getRow(2).values;
    console.log(`  Sample row 2:`, row2);
  }
}

scanExistingFiles().catch(console.error);
