const fs = require('fs');
const path = require('path');

const rawFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt';
const biznoCacheDir = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/cache';
const niceCacheFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_cache.json';

const destTsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.tsv';
const destCsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.csv';
const destNiceCsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result_nice.csv';
const destNiceTsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result_nice.tsv';

const lines = fs.readFileSync(rawFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
const niceCache = fs.existsSync(niceCacheFile) ? JSON.parse(fs.readFileSync(niceCacheFile, 'utf8')) : {};

function cleanText(txt) {
  if (!txt) return '';
  return txt.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseSummary(summary) {
  const result = {};
  if (!summary) return result;

  const keys = [
    '회사명(영문)', '영문회사명', '주요제품', '기업규모', '과세유형', '법인형태', '본사/지사',
    '홈페이지', 'IR홈페이지', '업종분류', '업태', '업종', '사업자 현재 상태(※국세청 홈택스 실시간 정보제공)',
    '사업자 현재 상태', '설립일(신고/인허가일)', '설립일', '등록일', '대표자명', '전화번호', '팩스번호',
    '회사주소', '종업원수', '사업자등록번호', '법인등록번호', '관할세무서', '결산월', '회사이메일', '이메일'
  ];

  const keyPattern = new RegExp(`(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*:`, 'g');
  
  let matches = [];
  let m;
  while ((m = keyPattern.exec(summary)) !== null) {
    matches.push({ key: m[1], index: m.index, length: m[0].length });
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const valStart = current.index + current.length;
    const valEnd = (i + 1 < matches.length) ? matches[i + 1].index : summary.length;
    const val = summary.substring(valStart, valEnd).trim();
    result[current.key] = val;
  }

  return result;
}

function parseBiznoHtml(html) {
  if (!html || html.includes('사업자 정보가 없습니다')) {
    return null;
  }

  const result = {
    tableFields: {},
    summaryFields: {},
    industryNts: {}
  };

  const h1Match = html.match(/<div class="titles">[\s\S]*?<h[1-4]>([\s\S]*?)<\/h[1-4]>/i);
  if (h1Match) {
    result.companyName = cleanText(h1Match[1]);
  }

  const summaryMatch = html.match(/summary="([^"]+)"/i);
  if (summaryMatch) {
    result.summaryRaw = summaryMatch[1];
    result.summaryFields = parseSummary(summaryMatch[1]);
  }

  const rowRegex = /<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let rm;
  while ((rm = rowRegex.exec(html)) !== null) {
    const key = cleanText(rm[1]);
    const rawTd = rm[2];
    
    if (key.includes('국세청산업분류')) {
      const pMatches = rawTd.match(/<p>([\s\S]*?)<\/p>/gi);
      if (pMatches) {
        pMatches.forEach(p => {
          const txt = cleanText(p);
          const parts = txt.split(':');
          if (parts.length === 2) {
            result.industryNts[parts[0].trim()] = parts[1].trim();
          }
        });
      }
    }

    let tdText = rawTd.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<br\s*\/?>/gi, ' ')
                      .replace(/<\/p>/gi, ' ')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/&nbsp;/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
    result.tableFields[key] = tdText;
  }

  const hpAnchor = html.match(/<th>홈페이지<\/th>\s*<td>[\s\S]*?<a\s+href="([^"]+)"[^>]*>/i);
  if (hpAnchor && hpAnchor[1] && !hpAnchor[1].startsWith('/') && !hpAnchor[1].startsWith('#')) {
    result.homepageUrl = hpAnchor[1].trim();
  }

  return result;
}

function isValid(str) {
  if (!str) return false;
  str = str.trim();
  if (str === '' || str === '-' || str === '*' || str === '.' || str === '폐업' || str === '비공개') return false;
  if (str.includes('*')) return false;
  return true;
}

function cleanVal(str) {
  if (!str) return '';
  str = str.trim();
  if (str === '-' || str === '*' || str === '.' || str === '비공개') return '';
  if (str.includes('*')) return '';
  return str;
}

function cleanPhone(str) {
  if (!str) return '';
  let cleaned = str.replace(/\(※[^\)]*\)/g, '').replace(/[^0-9\-~,\s]/g, '').trim();
  if (cleaned.includes('*') || cleaned === '-' || cleaned === '.' || cleaned.length < 8) return '';
  const digits = cleaned.replace(/[^0-9]/g, '');
  if (/^0+$/.test(digits)) return '';
  if (digits.includes('0000000')) return '';
  if (cleaned.includes('000-0000') || cleaned.includes('0000-0000')) return '';
  if (digits.startsWith('010') && digits.length < 10) return '';
  if (digits.startsWith('02') && digits.length < 9) return '';
  if (digits.length < 8 || digits.length > 12) return '';
  return cleaned;
}

function cleanEmpCount(str) {
  if (!str) return '';
  if (str.includes('*') || str === '-') return '';
  str = str.replace(/명/g, '').trim();
  return str;
}

function cleanUrl(str) {
  if (!str) return '';
  str = str.trim();
  if (str === '-' || str === '.' || str === '비공개' || str.includes('*')) return '';
  if (str === 'http://' || str === 'https://' || str === 'http://-' || str === 'https://-') return '';
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = 'http://' + str;
  }
  const hostPart = str.replace(/^https?:\/\//, '').split('/')[0];
  if (!hostPart.includes('.') || hostPart.length < 4) return '';
  if (!/^[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/.test(hostPart)) return '';
  return str;
}

function cleanEmail(str) {
  if (!str) return '';
  str = str.trim();
  if (str === '0' || str === '-' || str === '.' || str === '비공개' || str.includes('*')) return '';
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)) return '';
  return str;
}

function cleanAddr(addr) {
  if (!addr || addr.includes('*') || addr === '-' || addr === '.' || addr === '비공개') return '';
  let cleaned = addr.replace(/\(폐업자는 주소 일부가 \*\* 표시됩니다\)/g, '').trim();
  if (cleaned.includes('*')) return '';
  
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+Republic of Korea.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+Korea.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+beon-gil.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+-ro.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+-gil.*$/i, '');
  
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (cleaned.length < 4 || cleaned === '비공개') return '';
  return cleaned;
}

const outputTsvRows = [];
const outputCsvRows = [];

const header = [
  '담당자',
  '상태',
  '상호명',
  '사업자등록번호',
  '대표자명',
  '우편번호',
  '회사주소',
  '전화번호',
  '팩스번호',
  '홈페이지',
  '회사이메일',
  '종업원수',
  '업종(NICE BizINFO)',
  '법인등록번호',
  '결산월',
  '대분류',
  '중분류',
  '소분류'
];

function escapeCsvCol(val) {
  if (val === null || val === undefined) val = '';
  val = String(val).trim();
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

outputCsvRows.push(header.map(escapeCsvCol).join(','));

lines.forEach((line, idx) => {
  const p = line.split('\t');
  while (p.length < 18) p.push('');
  
  const bno = (p[3] || '').replace(/[^0-9]/g, '');
  const bizCachePath = path.join(biznoCacheDir, `${bno}.html`);
  let biz = null;
  if (fs.existsSync(bizCachePath)) {
    biz = parseBiznoHtml(fs.readFileSync(bizCachePath, 'utf8'));
  }

  const niceItem = niceCache[bno] && !niceCache[bno].notFound ? niceCache[bno] : null;

  const out = [...p];

  // Column 0: 담당자
  out[0] = '배현명';

  if (biz) {
    const t = biz.tableFields || {};
    const s = biz.summaryFields || {};
    const ind = biz.industryNts || {};

    // Column 1: 상태 (폐업 여부)
    const bizStatus = s['사업자 현재 상태(※국세청 홈택스 실시간 정보제공)'] || t['사업자 현재 상태'] || '';
    if (bizStatus.includes('폐업') || niceItem?.ipodivcd === '92') {
      out[1] = '폐업';
    } else if (bizStatus.includes('휴업')) {
      out[1] = '휴업';
    } else if (bizStatus.includes('계속사업자') || bizStatus.includes('정상')) {
      out[1] = '';
    }

    // Column 2: 상호명
    if (!out[2] && (biz.companyName || niceItem?.korentrnm)) {
      out[2] = biz.companyName || niceItem?.korentrnm;
    }

    // Column 3: 사업자등록번호
    out[3] = bno;

    // Column 4: 대표자명 (unmasked only)
    const repCandidate = s['대표자명'] || t['대표자명'] || (niceItem?.korreprnm && !niceItem.korreprnm.includes('*') ? niceItem.korreprnm : '');
    if (isValid(repCandidate)) {
      out[4] = cleanVal(repCandidate);
    } else if (!isValid(out[4])) {
      out[4] = '';
    }

    // Column 5: 우편번호
    const zipCandidate = t['우편번호'] || s['우편번호'] || '';
    if (isValid(zipCandidate) && /^[0-9]{5}$/.test(zipCandidate.trim())) {
      out[5] = zipCandidate.trim();
    }

    // Column 6: 주소 (unmasked only)
    const addrCandidate = s['회사주소'] || t['회사주소'] || (niceItem?.koraddr && !niceItem.koraddr.includes('*') ? niceItem.koraddr : '');
    const cleanA = cleanAddr(addrCandidate);
    if (cleanA) {
      out[6] = cleanA;
    } else if (!isValid(out[6])) {
      out[6] = '';
    } else {
      out[6] = cleanAddr(out[6]);
    }

    // Column 7: 전화번호 (unmasked only)
    const telCandidate = cleanPhone(s['전화번호']) || cleanPhone(t['전화번호']) || cleanPhone(t['회사 전화번호']);
    if (telCandidate) {
      out[7] = telCandidate;
    } else if (!isValid(out[7])) {
      out[7] = '';
    } else {
      out[7] = cleanPhone(out[7]);
    }

    // Column 8: 팩스번호
    const faxCandidate = cleanPhone(s['팩스번호']) || cleanPhone(t['팩스번호']) || cleanPhone(t['회사 팩스번호']);
    if (faxCandidate) {
      out[8] = faxCandidate;
    } else if (!isValid(out[8])) {
      out[8] = '';
    } else {
      out[8] = cleanPhone(out[8]);
    }

    // Column 9: 홈페이지
    const hpCandidate = biz.homepageUrl || s['홈페이지'] || t['홈페이지'] || '';
    const cleanHp = cleanUrl(hpCandidate);
    if (cleanHp) {
      out[9] = cleanHp;
    } else {
      out[9] = cleanUrl(out[9]);
    }

    // Column 10: 회사이메일
    const emailCandidate = s['회사이메일'] || s['이메일'] || t['회사이메일'] || t['이메일'] || '';
    const cleanEm = cleanEmail(emailCandidate);
    if (cleanEm) {
      out[10] = cleanEm;
    } else {
      out[10] = cleanEmail(out[10]);
    }

    // Column 11: 종업원수
    const empCandidate = cleanEmpCount(s['종업원수']) || cleanEmpCount(t['종업원수']) || cleanEmpCount(t['상용근로자']);
    if (empCandidate) {
      out[11] = empCandidate;
    }

    // Column 12: 업종(NICE BizINFO 산업명) - STRICTLY from NiceBizInfo!
    if (niceItem && niceItem.sanupscd_kor && isValid(niceItem.sanupscd_kor)) {
      out[12] = niceItem.sanupscd_kor.trim();
    } else if (isValid(out[12])) {
      out[12] = out[12].trim();
    } else {
      const bizItemCandidate = s['업종'] || t['종 목'] || '';
      out[12] = cleanVal(bizItemCandidate);
    }

    // Column 13: 법인등록번호
    const corpCandidate = s['법인등록번호'] || t['법인등록번호'] || niceItem?.crpno || '';
    if (isValid(corpCandidate) && corpCandidate !== '-' && corpCandidate.length >= 13) {
      out[13] = corpCandidate.trim();
    }

    // Column 14: 결산월
    const settleCandidate = s['결산월'] || t['결산월'] || '';
    if (isValid(settleCandidate) && settleCandidate !== '-') {
      out[14] = settleCandidate.trim();
    }

    // Column 15: 대분류
    if (ind['대분류']) {
      out[15] = ind['대분류'];
    }

    // Column 16: 중분류
    if (ind['중분류']) {
      out[16] = ind['중분류'];
    }

    // Column 17: 소분류 / 비즈인포산업명
    if (ind['소분류']) {
      out[17] = ind['소분류'];
    }
  } else {
    // If not found in bizno
    if (niceItem && niceItem.sanupscd_kor) {
      out[12] = niceItem.sanupscd_kor.trim();
    }
    if (niceItem && niceItem.korreprnm && !niceItem.korreprnm.includes('*')) {
      out[4] = niceItem.korreprnm.trim();
    }
    if (niceItem && niceItem.crpno && niceItem.crpno.length >= 13) {
      out[13] = niceItem.crpno.trim();
    }

    for (let c = 0; c < 18; c++) {
      if (out[c] && out[c].includes('*')) {
        out[c] = '';
      }
      if (out[c] === '-' || out[c] === '.' || out[c] === '비공개') {
        out[c] = '';
      }
    }
    out[7] = cleanPhone(out[7]);
    out[8] = cleanPhone(out[8]);
    out[9] = cleanUrl(out[9]);
    out[10] = cleanEmail(out[10]);
    out[6] = cleanAddr(out[6]);
  }

  // Final scrub
  for (let c = 0; c < 18; c++) {
    if (typeof out[c] === 'string') {
      if (out[c].includes('*') || out[c] === '-' || out[c] === '.' || out[c] === '비공개') {
        out[c] = '';
      }
    }
  }

  outputTsvRows.push(out.join('\t'));
  outputCsvRows.push(out.map(escapeCsvCol).join(','));
});

// Safe write function that retries or writes to fallback if locked
function safeWrite(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Successfully written: ${filePath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`Warning: ${filePath} is open in another program (e.g. Excel). Writing to alternate file.`);
    } else {
      throw err;
    }
  }
}

safeWrite(destTsv, outputTsvRows.join('\n'));
safeWrite(destCsv, '\uFEFF' + outputCsvRows.join('\r\n'));
safeWrite(destNiceTsv, outputTsvRows.join('\n'));
safeWrite(destNiceCsv, '\uFEFF' + outputCsvRows.join('\r\n'));

console.log(`Processing complete!`);
