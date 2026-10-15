import urllib.request

url = "https://bizno.net/article/6052724221"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=3) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\yangseok_raw.html', 'w', encoding='utf-8') as f:
    f.write(html)
