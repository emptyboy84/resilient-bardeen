const fs = require('fs');
const unzipper = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store/node_modules/unzipper');

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const directory = await unzipper.Open.file(filePath);
  const themeFile = directory.files.find(d => d.path === 'xl/theme/theme1.xml');
  if (themeFile) {
    const content = (await themeFile.buffer()).toString('utf8');
    console.log('Theme content:');
    const colorSchemeRegex = /<a:clrScheme[^>]*>([\s\S]*?)<\/a:clrScheme>/;
    const m = content.match(colorSchemeRegex);
    if (m) {
      console.log(m[1].replace(/></g, '>\n<'));
    }
  } else {
    console.log('theme1.xml not found');
  }
}

main().catch(console.error);
