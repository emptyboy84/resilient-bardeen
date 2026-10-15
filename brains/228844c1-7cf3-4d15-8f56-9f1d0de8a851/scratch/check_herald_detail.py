import urllib.request
import re

url = "https://bizno.net/article/6040256085"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>', html, re.DOTALL)
        for th, td in matches:
            cth = re.sub(r'<[^>]+>', '', th).strip()
            ctd = re.sub(r'<[^>]+>', '', td).strip()
            print(f"{cth}: {ctd}")
except Exception as e:
    print(e)
