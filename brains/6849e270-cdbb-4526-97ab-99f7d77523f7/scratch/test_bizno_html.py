import urllib.request
import urllib.parse

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = "https://bizno.net/?query=" + urllib.parse.quote("토마토전자")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Status: {resp.status}, Length: {len(html)}")
        with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bizno_sample.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Saved bizno_sample.html")
except Exception as e:
    print(f"Error: {e}")
