import json

with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/all_empty_rows.json", "r", encoding="utf-8") as f:
    data = json.load(f)

from_1091 = [r for r in data if r["row_idx"] >= 1091]
print(f"Count from 1091: {len(from_1091)}")
for r in from_1091[:15]:
    print(f"Row {r['row_idx']} ({r['순번']}): {r['사업체명']} | 설립: {r['설립연도']} | 대표: {r['대표자']} | 전화: {r['연락처']} | 구: {r['시군구']} | 주소: {r['주소']} | 업종: {r['업종']} | 비고: {r['비고']}")

with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/next_15_targets.json", "w", encoding="utf-8") as f:
    json.dump(from_1091[:15], f, ensure_ascii=False, indent=2)
