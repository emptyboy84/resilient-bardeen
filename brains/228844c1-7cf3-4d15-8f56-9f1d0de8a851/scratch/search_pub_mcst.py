import json
import urllib.request
import urllib.parse
import re
import time

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/real_unmatched_274.json', encoding='utf-8') as f:
    unmatched = json.load(f)

pub_rows = [r for r in unmatched if r['type'] == '출판']
print(f"Total publishing rows: {len(pub_rows)}")

results = []

for idx, r in enumerate(pub_rows):
    name = r['name']
    # Clean publisher name for query: remove (주), 주식회사, etc.
    q_name = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', name)
    
    # If ends with 출판사 or 출판, also try without
    queries = [name, q_name]
    if q_name.endswith("출판사") and len(q_name) > 3:
        queries.append(q_name[:-3])
    elif q_name.endswith("출판") and len(q_name) > 2:
        queries.append(q_name[:-2])
    
    found_mcst = []
    # Search MCST (Busan area: 6260000)
    for q in queries[:2]:
        url = "https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=" + urllib.parse.quote(q)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                if "검색된 데이터가 없습니다" not in html:
                    # extract list items
                    # rows in table
                    trs = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
                    for tr in trs:
                        tds = re.findall(r'<td[^>]*>(.*?)</td>', tr, re.DOTALL)
                        if len(tds) >= 6:
                            clean_tds = [re.sub(r'<[^>]+>', ' ', td).strip() for td in tds]
                            # check if busan
                            found_mcst.append(clean_tds)
            if found_mcst:
                break
        except Exception as e:
            pass
        time.sleep(0.1)
        
    results.append({
        "row_idx": r['row_idx'],
        "순번": r['순번'],
        "name": name,
        "phone": r['phone'],
        "rep": r['rep'],
        "addr": r['addr'],
        "mcst_matches": found_mcst
    })
    print(f"[{idx+1}/{len(pub_rows)}] {name} -> {len(found_mcst)} MCST matches")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/pub_mcst_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Publishing MCST search completed!")
