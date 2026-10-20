const fs = require('fs');

const html = fs.readFileSync('nice_jq5839.html', 'utf8');

// look for __NUXT__ or pinia or data
const m = html.match(/<script[^>]*>([\s\S]*?__NUXT__[\s\S]*?)<\/script>/) ||
          html.match(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/);

if (m) {
  console.log('Found script tag:', m[1].slice(0, 1000));
  fs.writeFileSync('nice_nuxt.js', m[1], 'utf8');
} else {
  console.log('No __NUXT__ script tag found, searching for JSON in scripts');
  const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach((s, i) => {
    if (s.includes('손정희') || s.includes('JQ5839') || s.includes('7928801504')) {
      console.log(`Script ${i} matches! Len: ${s.length}`);
      console.log(s.slice(0, 500));
      fs.writeFileSync(`nice_script_${i}.js`, s, 'utf8');
    }
  });
}
