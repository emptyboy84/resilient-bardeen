import json

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    targets = json.load(f)

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\sample_10.txt", "w", encoding="utf-8") as out:
    for idx, t in enumerate(targets[:15]):
        out.write(f"[{idx+1}] Row {t['row']} | 상호: {t['name']} | 대표: {t['ceo']} | 전화: {t['tel']} | 시군구: {t['sigungu']} | 주소: {t['addr']} | 업종: {t['industry']}\n")

print("Wrote sample 10 to sample_10.txt")
