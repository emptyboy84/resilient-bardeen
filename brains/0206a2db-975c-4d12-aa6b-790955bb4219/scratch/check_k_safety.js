const https = require('https');
const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\node_modules\\exceljs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function checkExcel() {
  const filePath = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\data\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.eachSheet((worksheet, sheetId) => {
    worksheet.eachRow((row, rowNumber) => {
      const values = row.values;
      const str = JSON.stringify(values);
      if (str.includes('8988802742') || str.includes('케이안전기술원')) {
        console.log(`EXCEL MATCH: sheet "${worksheet.name}" row ${rowNumber}:`, values);
      }
    });
  });
}

async function checkBizno() {
  console.log('\nChecking Bizno for 8988802742...');
  const res = await fetchUrl('https://bizno.net/article/8988802742');
  console.log('Bizno status:', res.status);
  const desc = res.body.match(/<meta name="description" content="([^"]+)"/);
  console.log('Bizno description:', desc ? desc[1] : 'No desc');
  
  const lines = res.body.split('\n');
  lines.forEach(l => {
    if (l.includes('종업원') || l.includes('대표자') || l.includes('회사주소') || l.includes('업태') || l.includes('업종')) {
      console.log('Bizno line:', l.trim());
    }
  });
}

async function main() {
  await checkExcel();
  await checkBizno();
}

main().catch(console.error);
