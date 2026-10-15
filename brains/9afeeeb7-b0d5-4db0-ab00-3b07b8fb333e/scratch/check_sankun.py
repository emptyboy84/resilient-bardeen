import urllib.request
import urllib.parse
import re

url = "https://sankun.com/company/3565017260/" + urllib.parse.quote("탑플랜트(주)")
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='replace')
        print("Sankun length:", len(html))
        # print text
        clean = re.sub(r'<[^>]+>', ' ', html)
        clean = re.sub(r'\s+', ' ', clean)
        print("Content:", clean[:1500])
except Exception as e:
    print(f"Error: {e}")
