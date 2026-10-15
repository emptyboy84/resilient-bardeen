import urllib.request
import re

url = 'https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0500&key=20230724.22018006509'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    raw = resp.read()
    text = raw.decode('euc-kr', errors='ignore')

clean = ' '.join(re.sub(r'<[^>]+>', ' ', text).split())
# find where 오희섭 or THE 5 appears
idx = clean.find('THE 5')
if idx == -1:
    idx = clean.find('오희섭')

if idx != -1:
    print(clean[max(0, idx-200):min(len(clean), idx+1500)])
else:
    print("Not found, printing portion:")
    print(clean[1000:3000])
