const blanks = require('./thursday_blanks.json');
blanks.forEach((b, i) => {
  console.log((i + 1) + '. [Row ' + b.row + ' / Seq ' + b.seq + '] ' + b.name + ' | 대표: ' + b.ceo + ' | 사업자: ' + b.bno + ' | ' + b.addr);
});
