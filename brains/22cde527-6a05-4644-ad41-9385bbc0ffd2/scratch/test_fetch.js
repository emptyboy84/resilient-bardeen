async function checkArticle(articleId) {
    const url = 'https://bizno.net/article/' + articleId;
    console.log('Fetching:', url);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    // Extract key table fields
    const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Snippet around address or name:');
    const idx = textOnly.indexOf('사업자등록번호');
    if (idx !== -1) {
        console.log(textOnly.slice(idx, idx + 600));
    } else {
        console.log(textOnly.slice(0, 500));
    }
}

checkArticle('3568700243');
