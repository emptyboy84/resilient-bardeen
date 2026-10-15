import urllib.request
import urllib.parse
import re

url = f"https://search.daum.net/search?w=tot&DA=YZR&q={urllib.parse.quote('다섯손가락 051-517-8828')}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

clean = ' '.join(re.sub(r'<[^>]+>', ' ', html).split())
idx = clean.find('051-517-8828')
if idx != -1:
    print(clean[max(0, idx-300):min(len(clean), idx+500)])
else:
    print("Not found")
