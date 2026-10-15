import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\user_raw_audit_results.json', 'r', encoding='utf-8') as f:
    issues = json.load(f)

print(f"Total Issues: {len(issues)}")

# Summary by issue type
type_map = {}
for iss in issues:
    t = iss['issue']
    type_map[t] = type_map.get(t, 0) + 1

for t, cnt in type_map.items():
    print(f" - {t}: {cnt}건")

print("\n--- [사업자번호 체크섬 오류 / 누락 목록] ---")
biz_issues = [i for i in issues if '사업자번호' in i['issue']]
for idx, bi in enumerate(biz_issues, 1):
    print(f"{idx}. 행 {bi['row']}: [{bi['name']}] - 현재값: '{bi['val']}' ({bi['issue']})")

print("\n--- [법인번호 오류 목록] ---")
corp_issues = [i for i in issues if '법인번호' in i['issue']]
for idx, ci in enumerate(corp_issues, 1):
    print(f"{idx}. 행 {ci['row']}: [{ci['name']}] - 현재값: '{ci['val']}' ({ci['issue']})")

print(f"\n--- [작성자 누락 건수: {len([i for i in issues if i['issue'] == '작성자 누락'])}건] ---")
