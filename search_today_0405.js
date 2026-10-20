const fs = require('fs');

const content = fs.readFileSync('C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt', 'utf8');
const lines = content.split('\n');
console.log('Total lines in verified file:', lines.length);

lines.forEach((line, idx) => {
  if (line.includes('923-0405') || line.includes('9230405')) {
    console.log('Exact hit line', idx, ':', line);
  }
  if (line.includes('0405') && (line.includes('051-') || line.includes('070-'))) {
    console.log('0405 phone hit line', idx, ':', line.split('\t')[0], line.split('\t')[1], line.split('\t')[9]);
  }
});
