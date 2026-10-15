import re

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_raw_나래바람.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find all href with article
links = re.findall(r'/article/\d+', html)
print("Unique article links for 나래바람:", list(set(links)))

# Find what tags wrap these links
matches = re.findall(r'<a\s+[^>]*href=["\'](/article/(\d+))["\'][^>]*>([\s\S]*?)</a>', html)
print(f"Matches count: {len(matches)}")
for m in matches[:10]:
    txt = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', m[2])).strip()
    print(f"  {m[1]} -> {txt}")
