with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_search_snippet.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
pl = re.search(r'<div class="col-lg-8 post-list">([\s\S]*?)</div>\s*<!--', html)
print(pl.group(1)[:1000])
