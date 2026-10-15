import urllib.request
import re

url = "https://bizno.net/article/3568700243"
headers = {"User-Agent": "Mozilla/5.0"}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Search for 센텀 or 해운대 or 주소 in html
matches = re.findall(r'(?:주소|소재지)[\s\S]{0,200}', html)
for m in matches:
    print("--- MATCH ---")
    print(m)
