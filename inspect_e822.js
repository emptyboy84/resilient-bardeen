const fs = require('fs');
const text = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/steps/554/output.txt', 'utf8');
const start = text.indexOf('table "기업 정보에 관련된 표입니다');
const end = text.indexOf('img "기업 분석 보고서 표지');
if (start !== -1 && end !== -1) {
  console.log(text.substring(start, end));
} else {
  console.log('Not found, start:', start, 'end:', end);
}
