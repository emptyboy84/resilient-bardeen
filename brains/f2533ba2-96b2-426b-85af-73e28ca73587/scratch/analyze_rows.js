const fs = require('fs');

const lines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/input_batch.tsv', 'utf-8')
  .split('\n')
  .filter(l => l.trim().length > 0);

function getBizType(bizno) {
  const clean = (bizno || '').replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  if (mid === '83') return '국가/지자체';
  if (mid === '84') return '외국법인';
  if (mid === '33') return '사내근로복지기금/단체';
  return '기타';
}

console.log('Total rows:', lines.length);

const parsed = lines.map((l, idx) => {
  const cols = l.split('\t');
  const name = cols[2];
  const bizno = cols[3];
  const rep = cols[4];
  const corpNoCol = cols[13];
  return {
    lineNo: idx + 1,
    name,
    bizno,
    rep,
    corpNoCol,
    bizType: getBizType(bizno),
  };
});

parsed.forEach(p => {
  console.log(`[${p.lineNo}] ${p.name} | biz:${p.bizno} (${p.bizType}) | corpCol: '${p.corpNoCol || ''}'`);
});
