import json
import re
from turbo_bizno_matcher import parse_search_page, clean_company_name, get_bizno_detail, score_detail

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    targets = json.load(f)

print(f"Total targets: {len(targets)}")

# Test on 30 targets with exact c_name first
matched = 0
for idx, t in enumerate(targets[200:250]): # Let's test rows around 2200-2264
    c_name = clean_company_name(t['name'])
    items = parse_search_page(c_name)
    best_cand = None
    best_score = 0
    for it in items:
        # Check if title matches target name
        t_clean = c_name.lower().replace(" ", "")
        it_clean = clean_company_name(it['title']).lower().replace(" ", "")
        if t_clean in it_clean or it_clean in t_clean:
            detail = get_bizno_detail(it['biz_no_10'])
            if detail:
                s = score_detail(t, detail)
                if s > best_score:
                    best_score = s
                    best_cand = detail
                    
    if best_cand and best_score >= 40:
        matched += 1
        print(f"[{idx+1}] MATCHED: Row {t['row']} | {t['name']} -> {best_cand['title']} ({best_cand['biz_no']}) | Emp: {best_cand['emp_cnt']} | CEO: {best_cand['ceo']} | Status: {best_cand['status']} | Addr: {best_cand['addr'][:35]}")
    else:
        print(f"[{idx+1}] Unmatched: Row {t['row']} | {t['name']} (Items: {len(items)}, best_score: {best_score})")

print(f"\nTested 50 targets: Matched {matched} / 50")
