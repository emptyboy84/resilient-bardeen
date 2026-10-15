import urllib.request
import urllib.parse
import json

# nicebizinfo search URL check
query = "8990100125"
url = f"https://www.nicebizinfo.com/ep/EP0100M001GE.nice?search_type=1&search_word={query}"

req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)

try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='replace')
        print("Nicebizinfo len:", len(html))
        with open("C:/Users/lg/.gemini/antigravity/brain/9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e/scratch/nicebiz_res.html", "w", encoding="utf-8") as f:
            f.write(html)
        for line in html.splitlines():
            if any(k in line for k in ["보연", "8990100125", "임대", "김혜진"]):
                print("Nice found:", line.strip()[:200])
except Exception as e:
    print(f"Error: {e}")
