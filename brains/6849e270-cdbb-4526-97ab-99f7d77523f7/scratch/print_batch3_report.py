import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\check_batch3.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total rows audited: {len(items)}")

normal_count = sum(1 for i in items if i['status'] == '정상')
error_count = sum(1 for i in items if i['status'] != '정상')

print(f"Normal: {normal_count}, Needs Attention: {error_count}")

print("\n--- Detailed Findings ---")
for item in items:
    if item['errors']:
        print(f"[{item['row']}행] {item['name']} ({item['biz_no']}):")
        for err in item['errors']:
            print(f"   - {err}")
