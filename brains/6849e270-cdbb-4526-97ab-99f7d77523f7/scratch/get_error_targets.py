import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\latest_batch_audit.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

biz_err_list = []
for r in rows:
    for e in r['errors']:
        if '사업자번호' in e and ('체크섬' in e or '오류' in e or '미기재' in e):
            biz_err_list.append({
                'row_id': r['row_id'],
                'name': r['name'],
                'biz_no': r['biz_no'],
                'ceo': r['ceo'],
                'addr': r['addr'],
                'corp_no': r['corp_no'],
                'error': e
            })

print(f"Total error companies: {len(biz_err_list)}")
with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\biz_err_targets.json', 'w', encoding='utf-8') as f:
    json.dump(biz_err_list, f, ensure_ascii=False, indent=2)

for item in biz_err_list:
    print(f"[{item['row_id']:3d}] {item['name']:25s} | 대표:{item['ceo']:6s} | 주소:{item['addr'][:30]:30s} | 기존사업자:{item['biz_no']}")
