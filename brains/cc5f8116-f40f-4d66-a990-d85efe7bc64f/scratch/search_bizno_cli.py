import urllib.request
import urllib.parse
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

query = sys.argv[1]
url = f"https://bizno.net/?query={urllib.parse.quote(query.strip())}"
req = urllib.request.Request(url, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=6) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
except Exception as e:
    print(f"Error fetching bizno search: {e}")
    sys.exit(0)

if '<div class="col-lg-4 sidebar">' in html:
    main_content = html.split('<div class="col-lg-4 sidebar">')[0]
else:
    main_content = html

posts = re.findall(r'<div class="single-post[\s\S]*?(?=<div class="single-post|<hr>|$)', main_content)
seen = set()
for p in posts:
    art_match = re.search(r'href=["\']/article/(\d{10})["\']', p)
    if not art_match: continue
    art_id = art_match.group(1)
    if art_id in seen: continue
    seen.add(art_id)
    
    title_match = re.search(r'<h[34][^>]*>(.*?)</h[34]>', p)
    title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else ""
    
    p_match = re.search(r'<p>([\s\S]*?)</p>', p)
    addr_snip = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', p_match.group(1))).strip() if p_match else ""
    
    print(f"[{art_id}] {title} | {addr_snip}")
