const fs = require('fs');
const readline = require('readline');

async function inspectTxtFiles() {
  const f1 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  const f2 = 'C:\\Users\\lg\\Desktop\\Today\\배현명_실사DB_누락전화번호_전수검증리포트.txt';
  const f3 = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.txt';

  console.log('--- Inspecting f1 head ---');
  if (fs.existsSync(f1)) {
    const lines = fs.readFileSync(f1, 'utf-8').split('\n').slice(0, 10);
    lines.forEach((l, i) => console.log(`f1 L${i+1}: ${l.slice(0, 100)}`));
  }

  console.log('--- Inspecting f2 head ---');
  if (fs.existsSync(f2)) {
    const lines = fs.readFileSync(f2, 'utf-8').split('\n').slice(0, 15);
    lines.forEach((l, i) => console.log(`f2 L${i+1}: ${l.slice(0, 100)}`));
  }

  console.log('--- Inspecting f3 head ---');
  if (fs.existsSync(f3)) {
    const lines = fs.readFileSync(f3, 'utf-8').split('\n').slice(0, 10);
    lines.forEach((l, i) => console.log(`f3 L${i+1}: ${l.slice(0, 100)}`));
  }
}
inspectTxtFiles();
