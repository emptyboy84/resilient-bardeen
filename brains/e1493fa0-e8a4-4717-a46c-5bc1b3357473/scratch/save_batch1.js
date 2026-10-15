const fs = require('fs');
const raw = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/.system_generated/steps/380/output.txt', 'utf-8');

const endOfResult = raw.indexOf('### Ran Playwright code');
const sub = endOfResult !== -1 ? raw.substring(0, endOfResult) : raw;
const jsonStart = sub.indexOf('[');
const jsonEnd = sub.lastIndexOf(']');

if (jsonStart !== -1 && jsonEnd !== -1) {
  const json = sub.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(json);
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/nice_batch_1.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('Saved', data.length, 'items for batch 1.');
  const found = data.filter(d => d.found);
  const notFound = data.filter(d => !d.found);
  console.log('Found:', found.length, 'Not found:', notFound.length);
  console.log('First 5 found:');
  found.slice(0, 5).forEach(f => console.log('[' + f.idx + '] ' + f.rawName + ' (' + f.rawBizno + ') => 산업명: \'' + f.industry + '\', source: ' + f.source));
  if (notFound.length > 0) {
    console.log('Not found list:', notFound.map(n => '[' + n.idx + '] ' + n.rawName + ' (' + n.rawBizno + ')').join(', '));
  }
} else {
  console.log('Could not find JSON in output');
}
