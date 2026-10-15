const fs = require('fs');

async function checkMissingNames() {
  const missing = [
    { name: "치즈박스", bno: "5154600375" },
    { name: "포스텍", bno: "5178800710" },
    { name: "미우디자인", bno: "5518501580" },
    { name: "모노플로우", bno: "5558802700" },
    { name: "동영기업", bno: "5228201013" },
    { name: "인영산업", bno: "5268500886" }
  ];

  for (const item of missing) {
    const res = await fetch(`https://bizno.net/?query=${encodeURIComponent(item.name)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    // find matching articles
    const artRegex = /<a\s+href="(\/article\/[0-9]+)">[\s\S]*?<h4>([\s\S]*?)<\/h4>/g;
    let m;
    console.log(`Results for ${item.name} (input bno: ${item.bno}):`);
    while ((m = artRegex.exec(html)) !== null) {
      console.log(`  ${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`);
    }
  }
}

checkMissingNames();
