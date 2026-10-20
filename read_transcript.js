const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/logs/transcript.jsonl', { encoding: 'utf8' })
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if ((obj.step_index >= 1750 && obj.step_index <= 1761) || (obj.step_index >= 1775 && obj.step_index <= 1785)) {
      if (obj.content && obj.source === 'MODEL' && obj.type === 'PLANNER_RESPONSE') {
        console.log('=== STEP', obj.step_index, '===');
        console.log(obj.content);
      }
    }
  } catch(e) {}
});
