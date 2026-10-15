const fs = require('fs');
const path = require('path');
const brainDir = 'C:/Users/lg/.gemini/antigravity/brain';
const convs = fs.readdirSync(brainDir);
for (const c of convs) {
  const p = path.join(brainDir, c, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf-8').split('\n');
    for (const l of lines) {
      if (l.includes('"USER_INPUT"')) {
        try {
          const json = JSON.parse(l);
          console.log(c, json.step_index, (json.content || '').substring(0, 100).replace(/\n/g, ' '));
        } catch(e) {}
      }
    }
  }
}
