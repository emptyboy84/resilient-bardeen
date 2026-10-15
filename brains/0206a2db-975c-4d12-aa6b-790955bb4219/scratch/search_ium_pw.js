const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to i-um search...');
  await page.goto('https://www.i-um.co.kr/kr/companies?search=%EC%BC%80%EC%9D%B4%EC%95%88%EC%A0%84%EA%B8%B0%EC%88%A0%EC%9B%90');
  await page.waitForTimeout(3000);
  
  const text = await page.innerText('body');
  console.log('Results length:', text.length);
  if (text.includes('케이안전기술원') || text.includes('윙스타워')) {
    console.log('Found on i-um!');
    const lines = text.split('\n');
    lines.forEach(l => {
      if (l.includes('케이안전기술원') || l.includes('윙스타워') || l.includes('7') || l.includes('23')) {
        console.log('  ', l.trim());
      }
    });
  } else {
    console.log('Not found on i-um companies search.');
  }

  // Also try searching for 윙스타워
  console.log('Searching for 윙스타워 on i-um...');
  await page.goto('https://www.i-um.co.kr/kr/companies?search=%EC%9C%99%EC%8A%A4%ED%83%80%EC%9B%8C');
  await page.waitForTimeout(3000);
  const textWing = await page.innerText('body');
  if (textWing.includes('케이안전기술원')) {
    console.log('Found 케이안전기술원 in 윙스타워 list!');
  } else {
    console.log('케이안전기술원 not in immediate 윙스타워 search text.');
  }

  await browser.close();
}

main().catch(console.error);
