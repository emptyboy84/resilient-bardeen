const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function main() {
  const baseSource = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';
  const targetPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const backupPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup_before_final_fix.xlsx';
  const repoPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

  // 1. Safety Backup of current Desktop file
  if (fs.existsSync(targetPath)) {
    console.log(`[1/5] Creating safety backup of current target file...`);
    fs.copyFileSync(targetPath, backupPath);
    console.log(`  -> Backup saved to: ${backupPath}`);
  }

  // 2. Load the complete reference workbook (which has all 3,026 orange cells & complete addresses)
  console.log(`[2/5] Loading complete master file: ${baseSource}...`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(baseSource);
  const ws = wb.getWorksheet('기업 정보');

  // 3. Apply the verified corrections
  console.log(`[3/5] Applying verified data corrections...`);

  // (1) 개인사업자 법인번호 오기재 공란(NULL) 처리 (5건)
  const personalBizRows = [
    { row: 5076, name: '미주물류', oldCorp: ws.getRow(5076).getCell(25).value },
    { row: 5097, name: '중부기업', oldCorp: ws.getRow(5097).getCell(25).value },
    { row: 5219, name: '태영정보통신', oldCorp: ws.getRow(5219).getCell(25).value },
    { row: 5280, name: '대성이앤지', oldCorp: ws.getRow(5280).getCell(25).value },
    { row: 11881, name: '선진정밀', oldCorp: ws.getRow(11881).getCell(25).value }
  ];

  personalBizRows.forEach(item => {
    const row = ws.getRow(item.row);
    row.getCell(25).value = null;
    console.log(`  - [행 ${item.row}] ${item.name}: 법인번호 '${item.oldCorp}' -> NULL (개인사업자 공란화)`);
  });

  // (2) 지점/관할코드 오류 정제 (2건)
  // Row 5237: 듀오정보 부산경남지사 -> 본사 법인등록번호 110111-1475410
  const r5237 = ws.getRow(5237);
  const oldDuo = r5237.getCell(25).value;
  r5237.getCell(25).value = '110111-1475410';
  console.log(`  - [행 5237] 듀오정보（주）부산경남지사: 법인번호 '${oldDuo}' -> '110111-1475410' (본사 관할 서울중앙 정규등기번호)`);

  // Row 5060: (주)쿤스트원 부산센텀지점 -> 본사 법인등록번호 110111-5965813
  const r5060 = ws.getRow(5060);
  const oldKunst = r5060.getCell(25).value;
  r5060.getCell(25).value = '110111-5965813';
  console.log(`  - [행 5060] (주)쿤스트원 부산센텀지점: 법인번호 '${oldKunst}' -> '110111-5965813' (본사 정규등기번호)`);

  // (3) 모노플로우(12288행) 확인
  const r12288 = ws.getRow(12288);
  console.log(`  - [행 12288] (주)모노플로우 상태 확인: 법인번호 = '${r12288.getCell(25).value}', 주소 = '${r12288.getCell(7).value}' (정상 보존 확인)`);

  // 4. Save directly to Target File
  console.log(`[4/5] Writing final workbook to: ${targetPath}...`);
  await wb.xlsx.writeFile(targetPath);
  console.log(`  -> Successfully written to target file!`);

  // Also update repo file
  console.log(`[5/5] Updating repository file: ${repoPath}...`);
  await wb.xlsx.writeFile(repoPath);
  console.log(`  -> Successfully updated repository file!`);

  console.log(`\n=== ALL TASKS COMPLETED SUCCESSFULLY! ===`);
}

main().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
