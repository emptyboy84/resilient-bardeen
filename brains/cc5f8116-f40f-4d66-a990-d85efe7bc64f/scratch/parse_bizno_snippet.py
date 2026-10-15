import re

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_search_snippet.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find blocks containing /article/
# Look at titles, addresses, CEOs
items = re.findall(r'<div class="titles">[\s\S]*?</div>', html)
print(f"Titles blocks: {len(items)}")
for i, item in enumerate(items[:5]):
    clean = re.sub(r'<[^>]+>', ' ', item).strip()
    print(f"Item {i+1}: {clean}")

# Look for table or description or address in each post
posts = re.findall(r'<div class="single-post[\s\S]*?</div>\s*</div>\s*</div>', html)
print(f"Posts: {len(posts)}")
if posts:
    print("Post 1 sample:")
    print(re.sub(r'<[^>]+>', ' ', posts[0])[:500])
