const fs = require('fs');

function parseBizno(html) {
  const data = {};
  
  // Check if article page exists or redirected to search/not found
  // Usually the table has class table_guide01
  const titleMatch = html.match(/<div class="titles">[\s\S]*?<h[1-4]>([^<]+)<\/h[1-4]>/);
  if (titleMatch) {
    data.companyName = titleMatch[1].trim();
  }
  
  const summaryMatch = html.match(/summary="([^"]+)"/);
  if (summaryMatch) {
    data.summary = summaryMatch[1];
  }
  
  // Extract table rows
  const rowRegex = /<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const key = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // remove script and inner html
    let val = match[2].replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<\/p>/gi, '\n')
                      .replace(/<[^>]+>/g, '')
                      .trim();
    val = val.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    data[key] = val;
  }
  
  return data;
}

const sampleBnos = ['5131909625', '5132200420', '5138144615', '5138531350', '5143563369', '5148634082', '5148801452', '5170900200'];

sampleBnos.forEach(bno => {
  const file = `C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/bizno_${bno}.html`;
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const parsed = parseBizno(html);
    console.log(`=== BNO: ${bno} ===`);
    console.log(JSON.stringify(parsed, null, 2));
  }
});
