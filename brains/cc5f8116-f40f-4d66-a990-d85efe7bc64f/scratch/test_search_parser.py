import urllib.request
import urllib.parse
import re

def parse_search_results(query):
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return []
        
    # Each result is inside <div class="single-post ..."> ... </div>
    # Let's find each post block
    posts = re.findall(r'<div class="single-post[\s\S]*?(?=<div class="single-post|<section|<footer>|$)', html)
    results = []
    for p in posts:
        # article id
        art_match = re.search(r'href=["\']/article/(\d{10})["\']', p)
        if not art_match:
            continue
        art_id = art_match.group(1)
        
        # title
        title_match = re.search(r'<h[12][^>]*>(.*?)</h[12]>', p)
        title = re.sub(r'<[^>]+>', ' ', title_match.group(1)).strip() if title_match else ""
        
        # address snippet or post text
        clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', p)).strip()
        
        results.append({
            "biz_no_10": art_id,
            "title": title,
            "snippet": clean_text
        })
    return results

res = parse_search_results("모두싸인")
print("모두싸인:", len(res))
for r in res[:3]:
    print(r["biz_no_10"], "|", r["title"], "|", r["snippet"][:100])

res2 = parse_search_results("아이티에프씨")
print("아이티에프씨:", len(res2))
for r in res2[:3]:
    print(r["biz_no_10"], "|", r["title"], "|", r["snippet"][:100])
