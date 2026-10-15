import urllib.request

url = "https://moneypin.biz/bizno/"
headers = {"User-Agent": "Mozilla/5.0"}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        html = resp.read().decode('utf-8', errors='ignore')
        print("Length:", len(html))
        print("Snippet:", html[:300])
except Exception as e:
    print("Error:", e)
