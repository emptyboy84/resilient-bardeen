const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\.system_generated\\steps\\579\\output.txt', 'utf8');

const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf(']');
if (jsonStart !== -1 && jsonEnd !== -1) {
  const jsonStr = content.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr);
  const visible = data.filter(i => i.type !== 'hidden' && i.type !== 'button');
  console.log('Visible inputs count:', visible.length);
  visible.forEach(i => console.log(i));
} else {
  console.log('JSON not found');
}
