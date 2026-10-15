import urllib.request
import re

url = "https://bizno.net/article/2506700234"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_2506700234.html", "w", encoding="utf-8") as f:
            f.write(html)
        # extract table or details
        lines = [re.sub(r'<[^>]+>', ' ', line).strip() for line in html.splitlines()]
        for line in lines:
            if any(k in line for k in ["상호", "대표", "주소", "상태", "업종", "전화", "등록"]):
                if len(line) < 100:
                    print(line)
except Exception as e:
    print(e)
