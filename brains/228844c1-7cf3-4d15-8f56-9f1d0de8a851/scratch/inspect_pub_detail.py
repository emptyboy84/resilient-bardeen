import json

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/real_unmatched_274.json', encoding='utf-8') as f:
    unmatched = json.load(f)

pub_rows = [r for r in unmatched if r['type'] == '출판']
with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/pub_rows_detail.txt', 'w', encoding='utf-8') as f:
    for idx, r in enumerate(pub_rows):
        f.write(f"[{idx+1}] Row {r['row_idx']} (순번 {r['순번']}): {r['name']} | Rep: {r['rep']} | Phone: {r['phone']} | Addr: {r['addr']}\n")

print(f"Saved {len(pub_rows)} details to pub_rows_detail.txt")
