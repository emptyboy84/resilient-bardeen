const fs = require('fs');
const lines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt', 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);

const bnoList = lines.map(l => {
  const p = l.split('\t');
  return {
    bno: (p[3] || '').replace(/[^0-9]/g, ''),
    name: p[2] || ''
  };
});

fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/bno_list.json', JSON.stringify(bnoList, null, 2), 'utf8');
console.log(`Saved ${bnoList.length} bnos to bno_list.json`);
