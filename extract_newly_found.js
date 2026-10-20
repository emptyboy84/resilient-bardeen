const fs = require('fs');

const step1 = JSON.parse(fs.readFileSync('step1_results.json', 'utf8'));
// Ensure 799
step1['799'] = {
  seq: '799',
  name: '아이티어스',
  ceo: '박진일',
  bizNo: '',
  address: '부산 해운대구 센텀중앙로 90 (재송동,큐비이센텀)',
  phone: '070-4616-7111'
};

const text = fs.readFileSync('input_raw_full.txt', 'utf8');
const lines = text.split(/\r?\n/);

let headerIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('순번') && lines[i].includes('기업명')) {
    headerIndex = i;
    break;
  }
}

const newlyFound = [];
for (let i = headerIndex + 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim() || line.startsWith('<') || line.startsWith('NOTE:')) continue;
  const cols = line.split('\t');
  const seq = cols[0].trim();
  if (!/^\d+$/.test(seq)) continue;

  const originalPhone = (cols[9] || '').trim();
  if (!originalPhone && step1[seq] && step1[seq].phone) {
    newlyFound.push({
      seq: seq,
      name: cols[1] || step1[seq].name,
      ceo: cols[2] || step1[seq].ceo,
      bizNo: cols[5] || step1[seq].bizNo,
      address: cols[8] || step1[seq].address,
      phone: step1[seq].phone
    });
  }
}

console.log('Total newly found:', newlyFound.length);
fs.writeFileSync('newly_found_list.json', JSON.stringify(newlyFound, null, 2), 'utf8');

// Generate markdown table for top newly found
console.log('| 순번 | 기업명 | 대표자명 | 사업자번호 | 검증 전화번호 | 주소 |');
console.log('| :---: | :--- | :---: | :---: | :---: | :--- |');
newlyFound.forEach(item => {
  console.log(`| ${item.seq} | ${item.name} | ${item.ceo} | ${item.bizNo} | **${item.phone}** | ${item.address} |`);
});
