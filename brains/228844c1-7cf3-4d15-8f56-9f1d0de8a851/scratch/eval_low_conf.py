import json

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_low_confidence.json', encoding='utf-8') as f:
    low = json.load(f)

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/low_confidence_eval.txt', 'w', encoding='utf-8') as f:
    for idx, item in enumerate(low):
        t = item['target']
        f.write(f"[{idx+1}] Score {item['confidence_score']}: Target '{t['name']}' ({t['type']}, {t['addr'][:20]}) -> Matched '{item['title']}' | Rep: target='{t['rep']}', bno='{item['rep']}' | Addr: '{item['bizno_addr'][:30]}' | BNO: {item['bno']}\n")

print(f"Wrote {len(low)} items to scratch/low_confidence_eval.txt")
