const fs = require('fs');
const readline = require('readline');

async function findFirstMention() {
  const filePath = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('7788102696') || line.includes('코리아스틸파워')) {
      const obj = JSON.parse(line);
      console.log('Step: ' + obj.step_index + ' | Type: ' + obj.type + ' | Source: ' + obj.source);
      if (obj.content && typeof obj.content === 'string') {
        const match = obj.content.split('\n').find(l => l.includes('코리아스틸파워'));
        if (match) console.log('Text: ' + match.trim());
      }
      break;
    }
  }
}
findFirstMention();
