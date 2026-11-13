const fs = require('fs');
const data = JSON.parse(fs.readFileSync('last_week_extracted.json', 'utf8'));

const companyMap = {};

data.forEach(item => {
  const line = item.line;
  // look for pattern like: 연번 XXX 또는 **상호명**: XXX
  const seqMatch = line.match(/연번\s*([0-9]+)/) || line.match(/Row\s*([0-9]+)/);
  const nameMatch = line.match(/\*\*([^*]+)\*\*/g) || [];
  
  if (seqMatch || line.includes('발굴') || line.includes('010-') || line.includes('051-')) {
    const key = item.date;
    if (!companyMap[key]) companyMap[key] = [];
    companyMap[key].push(line);
  }
});

Object.keys(companyMap).sort().forEach(date => {
  console.log(`\n================== DATE: ${date} (Total: ${companyMap[date].length}) ==================`);
  const uniqueLines = [...new Set(companyMap[date])];
  uniqueLines.forEach(l => {
    if (l.includes('연번') || l.includes('상호') || l.includes('발굴') || l.includes('대표')) {
      console.log(' ', l);
    }
  });
});
