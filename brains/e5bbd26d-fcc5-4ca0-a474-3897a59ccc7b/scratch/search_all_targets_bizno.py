import urllib.request
import urllib.parse
import re
import json

queries = [
    {"name": "이소민", "rep": "이소민", "phone": "010-2801-2662"},
    {"name": "엠엔에이윅스", "rep": "고태연", "phone": "010-4596-6062"},
    {"name": "깜냥깜냥", "rep": "민예진", "phone": "010-6711-6605"},
    {"name": "루미너스", "rep": "김동휘", "phone": "010-9401-6760"}
]

def search_bizno(q):
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'<a[^>]+href="(/article/(\d{10}))"[^>]*>(.*?)</a>', html, re.DOTALL)
            results = []
            for href, bno, inner in matches:
                title = re.sub(r'<[^>]+>', '', inner).strip()
                if title and not any(k in title for k in ["실시간", "인기검색어", "로그인", "회원가입"]):
                    results.append({"bno": bno, "title": title})
            return results
    except Exception as e:
        return [{"error": str(e)}]

output = {}
for item in queries:
    name_res = search_bizno(item["name"])
    rep_res = search_bizno(item["rep"])
    output[item["name"]] = {
        "query_name": name_res,
        "query_rep": rep_res
    }

with open("C:/Users/lg/.gemini/antigravity/brain/e5bbd26d-fcc5-4ca0-a474-3897a59ccc7b/scratch/search_results.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Finished searching bizno for all targets.")
