import urllib.request
import urllib.parse
import re

url = f"https://bizno.net/?query={urllib.parse.quote('모두싸인')}"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print("Length:", len(html))
# Extract all links with /article/\d+ and the surrounding text
matches = re.findall(r'<a\s+[^>]*href=["\'](/article/(\d+))["\'][^>]*>([\s\S]*?)</a>', html)
print("Matches:", len(matches))
for m in matches[:5]:
    print(m[1], re.sub(r'<[^>]+>', ' ', m[2]).strip())
