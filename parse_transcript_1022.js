const fs = require('fs');
const readline = require('readline');

async function readTranscript() {
  const p = 'C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/logs/transcript.jsonl';
  if (!fs.existsSync(p)) {
    console.log('No transcript file');
    return;
  }
  const fileStream = fs.createReadStream(p);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  const foundLogs = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const content = obj.content || '';
      if (obj.created_at && obj.created_at.includes('2026-10-22')) {
        if (content.includes('010-') || content.includes('051-') || content.includes('070-') || content.includes('발굴') || content.includes('연번')) {
          foundLogs.push({ step: obj.step_index, time: obj.created_at, type: obj.type, text: content.substring(0, 300) });
        }
      }
    } catch(e) {}
  }
  console.log('Found logs on 2026-10-22:', foundLogs.length);
  foundLogs.forEach(l => {
    console.log(`[${l.time}] Step ${l.step} (${l.type}): ${l.text.replace(/\n/g, ' ')}`);
  });
}
readTranscript();
