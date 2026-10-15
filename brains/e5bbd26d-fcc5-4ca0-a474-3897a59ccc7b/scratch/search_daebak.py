import urllib.request, urllib.parse, re, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def search(q):
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'<a[^>]+href="(/article/(\d{10}))"[^>]*>(.*?)</a>', html, re.DOTALL)
            results = []
            for href, bno, inner in matches:
                title = re.sub(r'<[^>]+>', '', inner).strip()
                if title and not any(k in title for k in ["실시간", "인기검색어", "로그인", "회원가입"]):
                    results.append((bno, title))
            return results
    except Exception as e:
        return [("error", str(e))]

print("Query: 대박만화")
for r in search("대박만화"):
    print(" ", r)

print("Query: 과정로 43")
for r in search("과정로 43"):
    print(" ", r)

print("Query: 망미동 431-9")
for r in search("망미동 431-9"):
    print(" ", r)
