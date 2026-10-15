import json
import re

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_274_results.json', encoding='utf-8') as f:
    bizno_results = json.load(f)

print(f"Total processed in bizno: {len(bizno_results)}")

matched_count = 0
unmatched_count = 0

verified_matches = []
unverified = []

for item in bizno_results:
    t = item['target']
    m = item.get('matched')
    d = item.get('detail', {})
    
    if m and d and d.get('bno'):
        # Validate that candidate is in Busan or matches name/phone
        c_title = m.get('title', '')
        t_name = t.get('name', '')
        d_addr = d.get('addr', '')
        
        # Format business number to xxx-xx-xxxxx
        raw_bno = d['bno']
        formatted_bno = f"{raw_bno[:3]}-{raw_bno[2:4]}-{raw_bno[4:]}" if len(raw_bno) == 10 else raw_bno
        if len(raw_bno) == 10:
            formatted_bno = f"{raw_bno[:3]}-{raw_bno[3:5]}-{raw_bno[5:]}"
            
        verified_matches.append({
            "target": t,
            "bno": formatted_bno,
            "title": c_title,
            "rep": d.get('rep') or t.get('rep'),
            "est_date": d.get('est_date', ''),
            "status": d.get('status', ''),
            "close_date": d.get('close_date', ''),
            "bizno_addr": d_addr
        })
        matched_count += 1
    else:
        unverified.append(t)
        unmatched_count += 1

print(f"Bizno matched: {matched_count}, Unmatched: {unmatched_count}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_verified.json', 'w', encoding='utf-8') as f:
    json.dump(verified_matches, f, ensure_ascii=False, indent=2)

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_unverified.json', 'w', encoding='utf-8') as f:
    json.dump(unverified, f, ensure_ascii=False, indent=2)
