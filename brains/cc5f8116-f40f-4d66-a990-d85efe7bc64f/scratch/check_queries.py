import urllib.request
import urllib.parse

def check_query(q):
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    print(f"Query '{q}': len={len(html)}")
    if "검색결과가 없습니다" in html or "결과가 없습니다" in html:
        print("  -> No results message found")
    with open(rf"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_raw_{q}.html", "w", encoding="utf-8") as f:
        f.write(html)

check_query("꿈해몽")
check_query("나래바람")
check_query("도서출판일광")
