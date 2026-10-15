import urllib.request
import re
import json

bnos = [
    "6033796242", "1342369602", "3800300630", "1531302205", "8929002257",
    "3309601771", "2065003634", "1812601711", "1249704980", "8902300358",
    "6372001513", "1221315161", "1269162698", "1629001763", "4130624909",
    "8472001070", "5522200070", "8274000319"
]

results = []
for bno in bnos:
    url = f"https://bizno.net/article/{bno}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract title
            title_m = re.search(r'<title>(.*?)</title>', html, re.I)
            title = title_m.group(1).strip() if title_m else ""
            # Extract table text
            rows = re.findall(r'<tr[\s\S]*?<\/tr>', html, re.I)
            row_dict = {}
            for r in rows:
                clean = re.sub(r'<[^>]+>', ' ', r).strip()
                parts = clean.split()
                if len(parts) >= 2:
                    row_dict[parts[0]] = " ".join(parts[1:])
            
            # Check for city/address
            results.append({
                "bno": bno,
                "title": title,
                "rep": row_dict.get("대표자명", ""),
                "status": row_dict.get("사업자", ""),
                "biz_type": row_dict.get("종", ""),
                "addr": row_dict.get("회사주소", ""),
                "tax_office": row_dict.get("관할세무서", "")
            })
    except Exception as e:
        results.append({"bno": bno, "error": str(e)})

with open("C:/Users/lg/.gemini/antigravity/brain/e5bbd26d-fcc5-4ca0-a474-3897a59ccc7b/scratch/isomin_bnos.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished scanning", len(results))
