const fs = require('fs');
const readline = require('readline');

async function getAllUserRequests() {
  const fileStream = fs.createReadStream('C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let allRequests = [];
  for await (const line of rl) {
    if (line.includes('USER_INPUT')) {
      const obj = JSON.parse(line);
      const text = obj.content || '';
      const lines = text.split('\n');
      for (const l of lines) {
        const parts = l.split('\t');
        if (parts.length >= 4 && /^\d+$/.test(parts[0].trim())) {
          allRequests.push({
            step: obj.step_index,
            date: obj.created_at ? obj.created_at.substring(0, 10) : 'unknown',
            seq: parseInt(parts[0].trim()),
            name: parts[1].trim(),
            ceo: parts[2]?.trim(),
            bno: parts[5]?.trim()
          });
        }
      }
    }
  }
  console.log('Total companies requested across chat:', allRequests.length);
  const byDate = {};
  allRequests.forEach(r => {
    byDate[r.date] = byDate[r.date] || [];
    byDate[r.date].push(r);
  });
  for (const [d, list] of Object.entries(byDate)) {
    const seqs = list.map(x => x.seq);
    console.log(d + ' (' + list.length + ' companies): min ' + Math.min(...seqs) + ', max ' + Math.max(...seqs));
    console.log('  Seqs: ' + seqs.join(', '));
  }
}
getAllUserRequests();
