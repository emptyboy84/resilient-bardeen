const fs = require('fs');

const origPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const finalPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx';

function testLock(p) {
  try {
    const fd = fs.openSync(p, 'r+');
    fs.closeSync(fd);
    return 'UNLOCKED';
  } catch (e) {
    return `LOCKED: ${e.code || e.message}`;
  }
}

console.log('Original file status:', testLock(origPath));
console.log('Final file status:', testLock(finalPath));
