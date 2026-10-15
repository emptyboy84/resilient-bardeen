import urllib.request

url = "https://bizno.net/?query=%EB%AA%A8%EB%91%90%EC%8Filtered%EC%9D%B8"
headers = {"User-Agent": "Mozilla/5.0"}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        print("Status:", resp.status)
except Exception as e:
    print("Error:", e)
