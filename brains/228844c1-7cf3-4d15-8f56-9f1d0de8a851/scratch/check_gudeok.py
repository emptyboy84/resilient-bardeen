import urllib.request
import urllib.parse
import re

url = "https://bizno.net/?area=%EB%B6%80%EC%82%B0&query=" + urllib.parse.quote("구덕로 19")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href="(/article/(\d+))"[^>]*>(.*?)</a>', html)
        for link, bno, title in matches:
            clean = re.sub(r'<[^>]+>', '', title).strip()
            print(bno, clean)
except Exception as e:
    print(e)
