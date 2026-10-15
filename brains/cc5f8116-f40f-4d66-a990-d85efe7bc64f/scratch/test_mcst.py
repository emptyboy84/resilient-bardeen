import urllib.request
import urllib.parse
import re

url = "https://book.mcst.go.kr/html/pblsh/pblshList.do"
data = urllib.parse.urlencode({
    "searchCondition": "title",
    "searchKeyword": "나래바람"
}).encode("utf-8")
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print("Length:", len(html))
        # Find rows
        rows = re.findall(r'<tr[\s\S]*?</tr>', html)
        print("Rows:", len(rows))
        for r in rows:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', r)).strip()
            print("Row:", clean)
except Exception as e:
    print("Error:", e)
