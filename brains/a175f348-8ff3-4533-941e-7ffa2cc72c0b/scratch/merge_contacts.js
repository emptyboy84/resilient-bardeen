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

async function mergeContacts() {
  const masterPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const originalBackupPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup.csv';
  const file18 = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_18컬럼_최종검증완료.csv';
  const fileLatest = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_검증완료_최신.csv';
  const fileCall = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_전화실사_통화검증_콜시트.csv';

  console.log('Loading contact source files...');
  
  // Build lookup maps by BizNo (사업자번호)
  const contactMap = new Map();

  // Load from file18
  if (fs.existsSync(file18)) {
    const lines = fs.readFileSync(file18, 'utf8').split(/\r?\n/).filter(l => l.trim());
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const bizNo = String(cols[3] || '').replace(/[^0-9]/g, '');
      if (!bizNo) continue;
      contactMap.set(bizNo, {
        note: cols[1],
        company: cols[2],
        rep: cols[4],
        zip: cols[5],
        addr: cols[6],
        phone: cols[7],
        fax: cols[8],
        hp: cols[9],
        email: cols[10],
        emp: cols[11],
        nice: cols[12],
        corpNo: cols[13],
        closing: cols[14],
        dae: cols[15],
        jung: cols[16],
        so: cols[17]
      });
    }
  }

  // Load from fileLatest
  if (fs.existsSync(fileLatest)) {
    const lines = fs.readFileSync(fileLatest, 'utf8').split(/\r?\n/).filter(l => l.trim());
    const header = parseCSVLine(lines[0]);
    // Find index of columns in fileLatest
    const bizIdx = header.indexOf('사업자번호');
    const phoneIdx = header.indexOf('전화번호');
    const faxIdx = header.indexOf('팩스번호');
    const hpIdx = header.indexOf('홈페이지');
    const emailIdx = header.indexOf('이메일');
    const addrIdx = header.indexOf('주소');
    const zipIdx = header.indexOf('우편번호');

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const bizNo = String(cols[bizIdx] || '').replace(/[^0-9]/g, '');
      if (!bizNo) continue;
      const existing = contactMap.get(bizNo) || {};
      if (phoneIdx !== -1 && cols[phoneIdx] && !existing.phone) existing.phone = cols[phoneIdx];
      if (faxIdx !== -1 && cols[faxIdx] && !existing.fax) existing.fax = cols[faxIdx];
      if (hpIdx !== -1 && cols[hpIdx] && !existing.hp) existing.hp = cols[hpIdx];
      if (emailIdx !== -1 && cols[emailIdx] && !existing.email) existing.email = cols[emailIdx];
      if (addrIdx !== -1 && cols[addrIdx] && !existing.addr) existing.addr = cols[addrIdx];
      if (zipIdx !== -1 && cols[zipIdx] && !existing.zip) existing.zip = cols[zipIdx];
      contactMap.set(bizNo, existing);
    }
  }

  // Load from call sheet
  if (fs.existsSync(fileCall)) {
    const lines = fs.readFileSync(fileCall, 'utf8').split(/\r?\n/).filter(l => l.trim());
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const bizNo = String(cols[4] || '').replace(/[^0-9]/g, '');
      const phone = cols[2];
      if (bizNo && phone) {
        const existing = contactMap.get(bizNo) || {};
        if (!existing.phone || existing.phone.startsWith('-')) {
          existing.phone = phone;
        }
        contactMap.set(bizNo, existing);
      }
    }
  }

  console.log(`Aggregated contact information for ${contactMap.size} companies.`);

  // Now apply to master CSV
  const masterLines = fs.readFileSync(masterPath, 'utf8').split(/\r?\n/);
  const origLines = fs.readFileSync(originalBackupPath, 'utf8').split(/\r?\n/);

  let updatedPhoneCount = 0;
  let updatedHpCount = 0;
  let updatedEmailCount = 0;
  let updatedFaxCount = 0;

  for (let i = 1; i < masterLines.length; i++) {
    if (!masterLines[i].trim()) continue;
    const cols = parseCSVLine(masterLines[i]);
    if (cols[0] === '배현명') {
      const bizNo = String(cols[3] || '').replace(/[^0-9]/g, '');
      const c = contactMap.get(bizNo);
      if (c) {
        if (c.phone && (!cols[7] || cols[7].trim() === '')) {
          cols[7] = c.phone.trim();
          updatedPhoneCount++;
        }
        if (c.fax && (!cols[8] || cols[8].trim() === '')) {
          cols[8] = c.fax.trim();
          updatedFaxCount++;
        }
        if (c.hp && (!cols[9] || cols[9].trim() === '')) {
          cols[9] = c.hp.trim();
          updatedHpCount++;
        }
        if (c.email && (!cols[10] || cols[10].trim() === '')) {
          cols[10] = c.email.trim();
          updatedEmailCount++;
        }
        if (c.addr && (!cols[6] || cols[6].trim() === '' || cols[6].length < c.addr.length)) {
          cols[6] = c.addr.trim();
        }
        if (c.zip && (!cols[5] || cols[5].trim() === '')) {
          cols[5] = c.zip.trim();
        }
      }

      // Also if col 7 is still empty, but respondent phone (col 55) is present, use it!
      if (!cols[7] && cols[55]) {
        cols[7] = cols[55].trim();
        updatedPhoneCount++;
      }

      masterLines[i] = toCSVLine(cols);
    }
  }

  // Save back to master CSV
  fs.writeFileSync(masterPath, masterLines.join('\r\n'), 'utf8');
  console.log(`Updated Master CSV. New phones: +${updatedPhoneCount}, New HPs: +${updatedHpCount}, New Emails: +${updatedEmailCount}, New Faxes: +${updatedFaxCount}`);

  // Re-run Orange Excel & HTML generation
  console.log('\nRegenerating Orange-highlighted Excel and HTML...');
  const { execSync } = require('child_process');
  execSync('node "C:\\Users\\lg\\.gemini\\antigravity\\brain\\a175f348-8ff3-4533-941e-7ffa2cc72c0b\\scratch\\generate_orange_excel.js"', { stdio: 'inherit' });
}

mergeContacts().catch(console.error);
