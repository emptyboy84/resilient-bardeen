const fs = require('fs');

const parsedInput = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', 'utf8')).slice(0, 58);

console.log('Total rows:', parsedInput.length);

parsedInput.forEach((r, idx) => {
  const c = r.cols;
  // c[0]: 작성자
  // c[1]: 상태/비고
  // c[2]: 상호
  // c[3]: 사업자등록번호
  // c[4]: 대표자
  // c[5]: 우편번호
  // c[6]: 주소
  // c[7]: 전화번호
  // c[8]: 팩스번호
  // c[9]: 홈페이지
  // c[10]: 이메일
  // c[11]: 종업원수
  // c[12]: 업종(세부)
  // c[13]: 법인등록번호
  // c[14]: 결산월
  // c[15]: 업종_대
  // c[16]: 업종_중
  // c[17]: 업종_소

  // Check if any column is shifted or suspicious
  // For example, if c[3] (bizNo) is not 10 digits
  if (c[3] && !c[3].match(/^\d{10}$/) && !c[3].match(/^\d{3}-\d{2}-\d{5}$/)) {
    console.log(`[Col Shift Warning] Row ${r.rowIdx} bizNo:`, c[3]);
  }
  // If c[5] (zip) has letters or non-digits (when not empty)
  if (c[5] && !c[5].match(/^\d{5}$/)) {
    console.log(`[Col Shift Warning] Row ${r.rowIdx} zip:`, c[5]);
  }
  // If c[13] (corpNo) has values
  if (c[13]) {
    // print corpNo
    // console.log(`Row ${r.rowIdx} corpNo: ${c[13]}`);
  }
  // If c[14] (closingMonth) has values not like 'XX월'
  if (c[14] && !c[14].includes('월')) {
    console.log(`[Col Shift Warning] Row ${r.rowIdx} closingMonth:`, c[14]);
  }
});
