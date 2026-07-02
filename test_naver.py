import urllib.request
import json
import urllib.parse

query = urllib.parse.quote('경남 거제시 장평3로 80')
url = f'https://map.naver.com/p/api/search/allSearch?query={query}&type=all&searchCoord=128.618635;34.896791&page=1'

req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://map.naver.com/p/'
})

try:
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        print(data[:500])
except Exception as e:
    print("Error:", e)
