const fs = require('fs');

const matches = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/team_db_correct_matches.json', 'utf8')
);

console.log(`Total matched from Team DB: ${matches.length}`);

// Filter matches that have either salesVal or valid phone or full address
const valuable = matches.filter(m => {
  const hasSales = m.teamSalesVal && m.teamSalesVal !== '-' && m.teamSalesVal !== '';
  const hasPhone = m.teamPhone && m.teamPhone !== '-' && m.teamPhone !== '';
  const hasCeo = m.teamCeo && m.teamCeo !== '-' && m.teamCeo !== '';
  const hasAddr = m.teamAddr && m.teamAddr !== '-' && m.teamAddr !== '';
  return hasSales || hasPhone || hasCeo || hasAddr;
});

console.log(`Valuable enriched matches: ${valuable.length}`);
valuable.forEach((m, i) => {
  console.log(`${i+1}. [Row ${m.masterRowNum}] ${m.masterName} | CEO: ${m.teamCeo} | Phone: ${m.teamPhone} | Sales: ${m.teamSalesVal} | Addr: ${m.teamAddr}`);
});
