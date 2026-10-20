const fs = require('fs');

const targets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
const results = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));

// Filter strictly those that do not have a phone number yet
const pureMissing = targets.filter(t => {
  const cleanBiz = t.bizNo.replace(/[^0-9]/g, '');
  return !results[cleanBiz];
});

console.log(`Initial missing in Cretap: ${targets.length}`);
console.log(`Already found in Stage 1: ${Object.keys(results).length}`);
console.log(`Pure missing targets remaining: ${pureMissing.length}`);

fs.writeFileSync('pure_missing_2658.json', JSON.stringify(pureMissing, null, 2), 'utf8');
console.log('Saved pure_missing_2658.json successfully.');
