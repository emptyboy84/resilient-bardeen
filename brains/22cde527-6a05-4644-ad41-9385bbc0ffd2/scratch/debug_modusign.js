async function debugModusign() {
    const res = await fetch('https://bizno.net/?query=' + encodeURIComponent('모두싸인'), {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const linkRegex = /<a\s+href="\/article\/([0-9]{10})"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a\s+href="\/article|\n\s*<div class="footer|\$)/gi;
    let lm;
    while ((lm = linkRegex.exec(html)) !== null) {
        console.log('Match:', lm[1], lm[2].replace(/<[^>]+>/g, '').trim(), '|', lm[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 80));
    }
}

debugModusign();
