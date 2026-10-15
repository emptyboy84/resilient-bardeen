import re

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bizno_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find links /article/
articles = re.findall(r'/article/\w+', html)
print("Articles found:", articles)

# find titles
titles = re.findall(r'class="titles"[^>]*>(.*?)</a>', html, re.DOTALL)
for t in titles:
    print("Title:", re.sub(r'<[^>]+>', '', t).strip())

# find any numbers
nums = re.findall(r'\d{3}-\d{2}-\d{5}', html)
print("Nums in search page:", nums)
