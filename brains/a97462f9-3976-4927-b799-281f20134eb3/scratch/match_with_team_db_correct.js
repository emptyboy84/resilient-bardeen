const fs = require('fs');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function matchWithTeamDBCorrect() {
  const targets = JSON.parse(
    fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json', 'utf8')
  );

  console.log(`Matching ${targets.length} blue targets with Team DB (Correct Columns)...`);

  const teamFilePath = 'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_기업정보.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(teamFilePath);
  const ws = wb.worksheets[0];

  function normBiz(b) {
    if (!b) return '';
    return String(b).replace(/[^0-9]/g, '');
  }

  function normName(n) {
    if (!n) return '';
    return String(n).replace(/\(주\)|주식회사|\s/g, '').toLowerCase();
  }

  const teamBizMap = new Map();
  const teamNameMap = new Map();

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const compName = row.getCell(3).value; // Col 3: 회사명
    const bizVal = row.getCell(4).value;   // Col 4: 사업자번호
    const ceo = row.getCell(5).value;      // Col 5: 대표자
    const addr = row.getCell(7).value;     // Col 7: 주소
    const phone = row.getCell(8).value;    // Col 8: 전화번호
    const emp = row.getCell(15).value;     // Col 15: 종업원수
    const salesYear = row.getCell(32).value; // Col 32: 매출년도
    const salesVal = row.getCell(33).value;  // Col 33: 최근매출액

    if (!compName && !bizVal) continue;

    const bNorm = normBiz(bizVal);
    const nNorm = normName(compName);

    const record = {
      rowNumInTeam: r,
      compName: String(compName || ''),
      biz: String(bizVal || ''),
      ceo: String(ceo || ''),
      addr: String(addr || ''),
      phone: String(phone || ''),
      emp: emp ? String(emp).trim() : '',
      salesYear: salesYear ? String(salesYear).trim() : '',
      salesVal: salesVal !== null && salesVal !== undefined ? salesVal : ''
    };

    if (bNorm && bNorm.length === 10) {
      teamBizMap.set(bNorm, record);
    }
    if (nNorm && nNorm.length >= 2) {
      if (!teamNameMap.has(nNorm)) {
        teamNameMap.set(nNorm, []);
      }
      teamNameMap.get(nNorm).push(record);
    }
  }

  console.log(`Indexed Team DB: ${teamBizMap.size} unique biz numbers, ${teamNameMap.size} unique company names.`);

  const matched = [];
  const matchedWithSales = [];

  targets.forEach(t => {
    const tBizNorm = normBiz(t.biz);
    const tNameNorm = normName(t.name);

    let match = null;
    let matchType = '';

    if (tBizNorm && teamBizMap.has(tBizNorm)) {
      match = teamBizMap.get(tBizNorm);
      matchType = 'BIZ_MATCH';
    } else if (tNameNorm && teamNameMap.has(tNameNorm)) {
      const candidates = teamNameMap.get(tNameNorm);
      match = candidates.find(c => c.addr.includes('부산')) || candidates[0];
      matchType = 'NAME_MATCH';
    }

    if (match) {
      const res = {
        masterRowNum: t.rowNum,
        masterName: t.name,
        masterBiz: t.biz,
        matchType,
        teamName: match.compName,
        teamBiz: match.biz,
        teamCeo: match.ceo,
        teamAddr: match.addr,
        teamPhone: match.phone,
        teamEmp: match.emp,
        teamSalesYear: match.salesYear,
        teamSalesVal: match.salesVal
      };
      matched.push(res);
      if (match.salesVal !== '') {
        matchedWithSales.push(res);
      }
    }
  });

  console.log(`\nResults against Blue Targets:`);
  console.log(`- Total Targets: ${targets.length}`);
  console.log(`- Matched with Team DB: ${matched.length}`);
  console.log(`- Matched WITH SALES in Team DB: ${matchedWithSales.length}`);

  matchedWithSales.forEach((m, idx) => {
    console.log(`${idx+1}. [Row ${m.masterRowNum}] ${m.masterName} -> Year: ${m.teamSalesYear}, Sales: ${m.teamSalesVal}, CEO: ${m.teamCeo}, Addr: ${m.teamAddr}, Phone: ${m.teamPhone}`);
  });

  fs.writeFileSync(
    'C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/team_db_correct_matches.json',
    JSON.stringify(matched, null, 2),
    'utf8'
  );
  console.log('Saved all matches to scratch/team_db_correct_matches.json');
}

matchWithTeamDBCorrect().catch(console.error);
