with open("C:/Users/lg/.gemini/antigravity/brain/9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e/scratch/nicebiz_res.html", "r", encoding="utf-8") as f:
    text = f.read()

import re
# check search results section
# look for table or company names
matches = re.findall(r'<a[^>]+goCmpyDtl[^>]*>(.*?)</a>', text)
print("goCmpyDtl matches:", matches)

# look for 8990100125
if "8990100125" in text:
    print("Found 8990100125 in text!")
else:
    print("8990100125 NOT found in nicebiz text")

if "보연" in text:
    print("Found '보연' in text!")
    # show around '보연'
    for m in re.finditer(r'보연', text):
        start = max(0, m.start() - 50)
        end = min(len(text), m.end() + 50)
        print("Context:", repr(text[start:end]))
else:
    print("'보연' NOT found in nicebiz text")
