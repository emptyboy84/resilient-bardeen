const fs = require('fs');
const readline = require('readline');

async function searchCurrentTranscript() {
  const filePath = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  console.log('=== SEARCHING CURRENT TRANSCRIPT ===');
  let step = 0;
  for await (const line of rl) {
    step++;
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const str = JSON.stringify(obj);
      if (str.includes('수학') || str.includes('공식') || str.includes('체크섬') || str.includes('checksum') || str.includes('가중치') || str.includes('1, 2, 1, 2') || str.includes('역산') || str.includes('계산')) {
        console.log(`[Step ${obj.step_index || step}] Type: ${obj.type} | Source: ${obj.source}`);
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            console.log(`   Tool: ${tc.name || tc.tool_name} | Action: ${tc.tool_action || ''}`);
            if (tc.arguments && tc.arguments.CommandLine) {
              console.log(`   Cmd: ${tc.arguments.CommandLine.substring(0, 150)}...`);
            }
          });
        }
        if (obj.content) {
          const c = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
          const linesC = c.split('\n');
          linesC.filter(l => l.includes('수학') || l.includes('공식') || l.includes('체크섬') || l.includes('checksum') || l.includes('가중치') || l.includes('계산') || l.includes('1, 2, 1, 2'))
            .slice(0, 3)
            .forEach(l => console.log('   Text:', l.trim().substring(0, 150)));
        }
      }
    } catch (e) {}
  }
}
searchCurrentTranscript();
