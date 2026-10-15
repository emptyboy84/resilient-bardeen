const fs = require('fs');
const readline = require('readline');

async function searchTranscript() {
  const fileStream = fs.createReadStream('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.includes('195511') || line.includes('대원오토텍')) {
      try {
        const obj = JSON.parse(line);
        console.log(`[Step ${obj.step_index}] ${obj.type} | ${obj.source}`);
        const text = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
        const matches = text.match(/.{0,60}(?:195511|대원오토텍).{0,60}/g);
        if (matches) {
          matches.slice(0, 5).forEach(m => console.log('   ...', m.replace(/[\r\n\t]+/g, ' ').trim(), '...'));
        }
      } catch (e) {}
    }
  }
}
searchTranscript();
