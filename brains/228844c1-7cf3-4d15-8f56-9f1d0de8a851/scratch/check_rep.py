import urllib.request
import urllib.parse
import re

path = urllib.parse.quote("/대표자조회/")
query = urllib.parse.urlencode({"area": "부산", "query": "오은정"})
url = f"https://bizno.net{path}?{query}"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        raw = resp.read()
        html = raw.decode('utf-8', errors='ignore')
        with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_oeunjeong.html", "w", encoding="utf-8") as f:
            f.write(html)
        matches = re.findall(r'<a[^>]+href="(/article/\d+)"[^>]*>(.*?)</a>', html, re.DOTALL)
        for link, title in matches:
            clean = re.sub(r'<[^>]+>', '', title).strip()
            if clean:
                print(link, clean)
except Exception as e:
    print("Error:", e)
