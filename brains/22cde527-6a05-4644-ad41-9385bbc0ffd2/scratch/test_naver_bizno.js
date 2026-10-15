const { fetchNaverSearch, extractBizNumbersFromText } = require('./naver_utils');

async function testNaver() {
  const queries = [
    '동아대학교출판부 사업자등록번호',
    '동아대학교출판부 부산',
    '"나래바람" "051-612-2133"',
    '도서출판일광 기장',
    '"동화사" "051-464-0761"',
    '"한국산업정보사" "051-504-6877"'
  ];

  for (const q of queries) {
    const html = await fetchNaverSearch(q);
    const biznos = extractBizNumbersFromText(html);
    console.log(`Query: [${q}] -> Found BizNos:`, biznos);
    // find snippets
    const snippetRegex = /.{0,50}(?:\d{3}-\d{2}-\d{5}|동아대학교출판부|나래바람|도서출판일광).{0,50}/g;
    // show first 2 snippets
    const m = html.replace(/<[^>]+>/g, ' ').match(snippetRegex);
    if (m && m.length > 0) {
      console.log(' Snippets:', m.slice(0, 2).map(s => s.trim().replace(/\s+/g, ' ')));
    }
  }
}

testNaver();
