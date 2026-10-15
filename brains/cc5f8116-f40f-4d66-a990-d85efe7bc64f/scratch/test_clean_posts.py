import re

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_search_snippet.html", "r", encoding="utf-8") as f:
    html = f.read()

def parse_main_posts(html):
    if '<div class="col-lg-4 sidebar">' in html:
        main_content = html.split('<div class="col-lg-4 sidebar">')[0]
    else:
        main_content = html
        
    posts = re.findall(r'<div class="single-post[\s\S]*?(?=<div class="single-post|<hr>|$)', main_content)
    results = []
    for p in posts:
        art_match = re.search(r'href=["\']/article/(\d{10})["\']', p)
        if not art_match: continue
        art_id = art_match.group(1)
        
        title_match = re.search(r'<h[34][^>]*>(.*?)</h[34]>', p)
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else ""
        
        p_match = re.search(r'<p>([\s\S]*?)</p>', p)
        addr_snip = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', p_match.group(1))).strip() if p_match else ""
        
        results.append({
            "biz_no_10": art_id,
            "title": title,
            "addr_snip": addr_snip
        })
    return results

res = parse_main_posts(html)
print("Parsed main posts:", len(res))
for r in res:
    print("  ->", r)
