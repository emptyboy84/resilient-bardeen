const fs = require('fs');

const step1 = JSON.parse(fs.readFileSync('step1_results.json', 'utf8'));

// 1. Fix national representative numbers with false prefixes (e.g., 02-1544, 02-1666, 051-1670)
for (const [seq, item] of Object.entries(step1)) {
  if (!item.phone) continue;

  // 02-15xx / 02-16xx / 02-18xx
  const natMatch = item.phone.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (natMatch) {
    console.log(`Fixing prefix: ${seq} ${item.name} (${item.phone} -> ${natMatch[1]})`);
    item.phone = natMatch[1];
  }

  // False 02-1577-0000
  if (item.phone === '02-1577-0000' || item.phone === '1577-0000') {
    console.log(`Removing generic fake phone: ${seq} ${item.name}`);
    item.phone = '';
  }
}

fs.writeFileSync('step1_results.json', JSON.stringify(step1, null, 2), 'utf8');

// Also update final files
const execSync = require('child_process').execSync;
execSync('node build_final_outputs.js');
execSync('node save_utf8_table.js');
console.log('Regenerated outputs with cleaned phone numbers.');
