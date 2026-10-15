const fs = require('fs');
const path = require('path');

const rawFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt';
const cacheDir = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/cache';

const lines = fs.readFileSync(rawFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);

function cleanText(txt) {
  if (!txt) return '';
  return txt.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseSummary(summary) {
  const result = {};
  if (!summary) return result;
  
  // Example summary:
  // 룩스텍에 대한 사업자정보 주요제품 : LED조명 기업규모 : 중소기업 과세유형 : 부가가치세 일반과세자 법인형태 : 개인과세사업자 본사/지사 : 본사 홈페이지 : www.luxtec.kr 업종분류 : 제조업 > 전기장비 제조업 > 전구 및 조명장치 제조업 > 조명장치 제조업 > 일반용 전기 조명장치 제조업 업태 : 제조업 업종 : 일반용 전기 조명장치 제조업 사업자 현재 상태(※국세청 홈택스 실시간 정보제공) : 폐업자 설립일(신고/인허가일) : 2014-04-25 대표자명 : 김길연 전화번호 : 054-464-1172 팩스번호 : 054-464-1173 회사주소 : 경상북도 구미시 산호대로 363 종업원수 : 2명 사업자등록번호 : 513-19-09625 법인등록번호 : ...
  const keys = [
    '회사명(영문)', '영문회사명', '주요제품', '기업규모', '과세유형', '법인형태', '본사/지사',
    '홈페이지', 'IR홈페이지', '업종분류', '업태', '업종', '사업자 현재 상태(※국세청 홈택스 실시간 정보제공)',
    '사업자 현재 상태', '설립일(신고/인허가일)', '설립일', '등록일', '대표자명', '전화번호', '팩스번호',
    '회사주소', '종업원수', '사업자등록번호', '법인등록번호', '관할세무서', '결산월', '회사이메일', '이메일'
  ];

  // Regex to split by keys
  // Build a regex matching any of these keys followed by :
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
  if (!html) return null;
  if (html.includes('사업자 정보가 없습니다')) {
    return { notFound: true };
  }

  const result = {
    notFound: false,
    tableFields: {},
    summaryFields: {},
    industryNts: {}
  };

  // Company Name
  const h1Match = html.match(/<div class="titles">[\s\S]*?<h[1-4]>([\s\S]*?)<\/h[1-4]>/i);
  if (h1Match) {
    result.companyName = cleanText(h1Match[1]);
  }

  // Summary
  const summaryMatch = html.match(/summary="([^"]+)"/i);
  if (summaryMatch) {
    result.summaryRaw = summaryMatch[1];
    result.summaryFields = parseSummary(summaryMatch[1]);
  }

  // Table rows
  const rowRegex = /<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let rm;
  while ((rm = rowRegex.exec(html)) !== null) {
    const key = cleanText(rm[1]);
    const rawTd = rm[2];
    
    // Check if key is 국세청산업분류
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

    // Extract cleaned td text
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

  // Also check homepage anchor if present
  const hpAnchor = html.match(/<th>홈페이지<\/th>\s*<td>[\s\S]*?<a\s+href="([^"]+)"[^>]*>/i);
  if (hpAnchor && hpAnchor[1] && !hpAnchor[1].startsWith('/') && !hpAnchor[1].startsWith('#')) {
    result.homepageUrl = hpAnchor[1].trim();
  }

  return result;
}

const stats = {
  total: lines.length,
  foundInBizno: 0,
  notFound: 0
};

const parsedRows = [];

lines.forEach((line, idx) => {
  const parts = line.split('\t');
  const bno = (parts[3] || '').replace(/[^0-9]/g, '');
  const cachePath = path.join(cacheDir, `${bno}.html`);
  let html = '';
  if (fs.existsSync(cachePath)) {
    html = fs.readFileSync(cachePath, 'utf8');
  }

  const parsed = parseBiznoHtml(html);
  if (parsed && !parsed.notFound && (parsed.companyName || Object.keys(parsed.tableFields).length > 0)) {
    stats.foundInBizno++;
    parsedRows.push({ idx, bno, original: parts, parsed });
  } else {
    stats.notFound++;
    parsedRows.push({ idx, bno, original: parts, parsed: null });
  }
});

console.log('Stats:', stats);

// Print first 5 parsed details
console.log('Sample parsed 0:', JSON.stringify(parsedRows[0], null, 2));
console.log('Sample parsed 1:', JSON.stringify(parsedRows[1], null, 2));
console.log('Sample parsed 2:', JSON.stringify(parsedRows[2], null, 2));
