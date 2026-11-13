const fs = require('fs');
const readline = require('readline');

async function checkThursdayDetails() {
  const fileStream = fs.createReadStream('C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('PLANNER_RESPONSE')) {
      const obj = JSON.parse(line);
      const date = obj.created_at ? obj.created_at.substring(0, 10) : '';
      if (date === '2026-10-21' || date === '2026-10-22') {
        const text = obj.content || '';
        // If text contains phone number patterns like 010-, 051-, 070-, 02-
        if (/010-\d{4}-\d{4}|051-\d{3,4}-\d{4}|070-\d{4}-\d{4}|1\d{3}-\d{4}/.test(text)) {
          console.log('=== Step:', obj.step_index, 'Date:', obj.created_at, '===');
          // print lines with numbers or company names
          const lines = text.split('\n');
          lines.forEach(l => {
            if (/010-|051-|070-|1\d{3}-|상호|기업명|대표|발굴|번호/.test(l)) {
              console.log(l.substring(0, 120));
            }
          });
        }
      }
    }
  }
}
checkThursdayDetails();
