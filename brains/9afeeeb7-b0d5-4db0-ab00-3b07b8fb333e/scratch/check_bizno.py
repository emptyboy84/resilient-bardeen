import urllib.request
import gzip

url = "https://bizno.net/?query=8990100125"
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
        
        with open("C:/Users/lg/.gemini/antigravity/brain/9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e/scratch/bizno_res.html", "w", encoding="utf-8") as f:
            f.write(html)
            
        for line in html.splitlines():
            clean = line.strip()
            if any(k in clean for k in ["보연", "8990100125", "899-01-00125", "김혜진", "폐업", "계속", "임대", "종업원", "상태"]):
                if len(clean) < 300:
                    print("Found:", clean)
except Exception as e:
    import traceback
    traceback.print_exc()
