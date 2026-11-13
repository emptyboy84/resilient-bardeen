const ExcelJS = require('exceljs');
const fs = require('fs');

const fileLatest = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
const fileBHM = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';

async function checkFoundAndNulls() {
  const tempPath = 'temp_check_status.xlsx';
  fs.copyFileSync(fileLatest, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];
  
  // 1. Check our previously found targets
  const foundList = [
    { no: 1042, row: 1043, name: '영화사손가락', found: '010-3438-3547' },
    { no: 1080, row: 1081, name: '(주)누리브릿지', found: '010-3436-1285' },
    { no: 1081, row: 1082, name: '(주)디퍼즈', found: '1661-7038' },
    { no: 1106, row: 1107, name: '(주)샐러드볼', found: '010-2579-3527' },
    { no: 1132, row: 1133, name: '(주)마인드코어', found: '010-7297-7895' },
    { no: 1133, row: 1134, name: '솔민상사', found: '010-4558-7434' },
    { no: 1150, row: 1151, name: '(주)코라소프트', found: '070-4252-2723' },
    { no: 1151, row: 1152, name: '(주)디웰랩', found: '010-8550-2773' },
    { no: 1185, row: 1186, name: '(주)찬란한미래', found: '010-3244-9161' }
  ];
  
  console.log('=== 1. PREVIOUSLY FOUND STATUS IN LATEST FILE ===');
  foundList.forEach(t => {
    const row = ws.getRow(t.row);
    const curVal = row.getCell(10).value;
    const font = row.getCell(10).font?.color?.argb;
    const fill = row.getCell(10).fill?.fgColor?.argb;
    console.log(`[연번 ${t.no} ${t.name}] 현재값: ${curVal} (Font: ${font}, Fill: ${fill}) -> 발굴값: ${t.found}`);
  });
  
  // 2. Scan rows from 1040 to 1180 to find all NULL rows!
  console.log('\n=== 2. SCANNING NULL ROWS (1040 ~ 1180) ===');
  const nullTargets = [];
  for (let r = 1041; r <= 1180; r++) {
    const row = ws.getRow(r);
    const no = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const type = row.getCell(5).value;
    const brno = row.getCell(6).value;
    const corpno = row.getCell(7).value;
    const ind = row.getCell(8).value;
    const addr = row.getCell(9).value;
    const phone = row.getCell(10).value;
    
    if (!phone || String(phone).trim() === '') {
      nullTargets.push({ row: r, no, name, ceo, type, brno, corpno, ind, addr });
    }
  }
  
  console.log(`Total NULL targets between row 1041 and 1180: ${nullTargets.length}`);
  console.log('List of NULL targets:');
  nullTargets.forEach(t => {
    console.log(`Row ${t.row} (연번 ${t.no}): [${t.name}] 대표:${t.ceo} | 사번:${t.brno} | 업종:${t.ind} | 주소:${t.addr}`);
  });
  
  fs.unlinkSync(tempPath);
}

checkFoundAndNulls().catch(e => console.error(e));
