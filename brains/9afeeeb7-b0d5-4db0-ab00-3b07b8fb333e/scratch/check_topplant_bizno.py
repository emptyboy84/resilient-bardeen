import urllib.request
import gzip

bno = "8998100224"
url = f"https://bizno.net/?query={bno}"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Encoding": "gzip, deflate"
    }
)

try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        raw = resp.read()
        if resp.info().get('Content-Encoding') == 'gzip':
            raw = gzip.decompress(raw)
        
        html = raw.decode('utf-8', errors='replace')
        print(f"Decoded length: {len(html)}")
        
        for line in html.splitlines():
            clean = line.strip()
            if any(k in clean for k in ["탑플랜트", bno, "899-81-00224", "노정하", "폐업", "계속", "제조업", "법인"]):
                if len(clean) < 300:
                    print("Found:", clean)
except Exception as e:
    import traceback
    traceback.print_exc()
