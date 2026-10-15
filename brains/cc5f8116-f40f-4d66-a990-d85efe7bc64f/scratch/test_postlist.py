with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_search_snippet.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

# Look for post-list
pl = re.search(r'<div class="col-lg-8 post-list">([\s\S]*?)</div>\s*<!--', html)
if not pl:
    pl = re.search(r'<div class="[^"]*post-list[^"]*">([\s\S]*?)</div>\s*<div class="[^"]*sidebar', html)
    
if pl:
    print("Found post-list! Length:", len(pl.group(1)))
    posts = re.findall(r'<div class="single-post[\s\S]*?</div>\s*</div>\s*</div>', pl.group(1))
    print("Posts inside post-list:", len(posts))
    for p in posts:
        b10 = re.search(r'/article/(\d{10})', p)
        print("  Post art_id:", b10.group(1) if b10 else "none")
else:
    print("post-list not matched with current regex")
