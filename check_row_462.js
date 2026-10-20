const fs = require('fs');

async function checkRow462() {
  const content = fs.readFileSync('C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt', 'utf8');
  const lines = content.split('\n');
  const line = lines.find(l => l.startsWith('462\t') || l.includes('452-88-03055'));
  console.log('Current in Today file:', line);
}
checkRow462();
