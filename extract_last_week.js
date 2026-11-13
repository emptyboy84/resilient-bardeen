const fs = require('fs');
const readline = require('readline');

async function extractAllLastWeek() {
  const p = 'C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/logs/transcript.jsonl';
  const fileStream = fs.createReadStream(p);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  const weeklySummary = [];
  
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const date = (obj.created_at || '').substring(0, 10);
      
      // Filter for last week (2026-10-19 to 2026-10-23)
      if (date >= '2026-10-19' && date <= '2026-10-23') {
        if (obj.type === 'PLANNER_RESPONSE' && obj.content) {
          const content = obj.content;
          // check if this response mentions specific companies or phone numbers
          const lines = content.split('\n');
          lines.forEach(l => {
            if (/연번|상호명|기업명|대표|발굴|010-|051-|070-|15\d{2}|16\d{2}|18\d{2}/.test(l)) {
              if (l.length < 200 && l.trim().length > 5) {
                weeklySummary.push({ date, line: l.trim() });
              }
            }
          });
        }
      }
    } catch(e) {}
  }
  
  fs.writeFileSync('last_week_extracted.json', JSON.stringify(weeklySummary, null, 2));
  console.log('Extracted entries:', weeklySummary.length);
}
extractAllLastWeek();
