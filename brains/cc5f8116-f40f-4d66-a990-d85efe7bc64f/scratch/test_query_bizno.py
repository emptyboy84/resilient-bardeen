import urllib.request
import urllib.parse
import re
import json
import time

def search_bizno(name):
    # Try searching on bizno
    url = f"https://bizno.net/?query={urllib.parse.quote(name)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract article links and titles
            # Structure: <div class="titles"> <a href="/article/(\d+)"><h1>(.*?)</h1></a>
            matches = re.findall(r'href=["\'](/article/(\d+))["\'][^>]*>[\s\S]*?<h[12][^>]*>(.*?)</h[12]>', html)
            
            # Also extract snippets
            posts = re.findall(r'<div class="single-post[\s\S]*?</div>\s*</div>\s*</div>', html)
            results = []
            for m in matches:
                link, biz_no, title = m
                clean_title = re.sub(r'<[^>]+>', '', title).strip()
                results.append({"biz_no": biz_no, "title": clean_title})
            return results
    except Exception as e:
        return []

test_names = ["꿈해몽", "나래바람", "녹생광고연합그린하우징", "동그라미광고공사", "동화사", "라온엔터테인먼트", "메리데브", "무몽크", "모두싸인"]

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_test_res.txt", "w", encoding="utf-8") as out:
    for name in test_names:
        res = search_bizno(name)
        out.write(f"Search: '{name}' -> Found {len(res)} results\n")
        for r in res[:3]:
            out.write(f"   {r['biz_no']} | {r['title']}\n")
        time.sleep(1)

print("Finished bizno test")
