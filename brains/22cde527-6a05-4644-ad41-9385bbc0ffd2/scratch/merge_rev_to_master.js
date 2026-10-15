const fs = require('fs');
const path = require('path');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const revFile = path.join(SCRATCH, 'revenue_found_saramin_v2.json');

const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
const revList = JSON.parse(fs.readFileSync(revFile, 'utf8'));

const revMap = {};
for (const r of revList) {
  revMap[r.rowNumber] = r;
}

let updated = 0;
for (const item of masterList) {
  const r = revMap[item.rowNumber];
  if (r && r.won) {
    item.sales2024 = r.formattedWon;
    item.rawSales = r.rawRevenue;
    item.salesWon = r.won;
    item.salesSource = r.saraminUrl;
    updated++;
  }
}

fs.writeFileSync(masterFile, JSON.stringify(masterList, null, 2), 'utf8');
console.log(`Updated master_verified_194.json with ${updated} revenue records!`);
