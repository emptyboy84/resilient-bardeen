import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\corp_no_audit.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

lines = []
lines.append("=== [1. 법인등록번호 체크섬 불일치 (오타 의심 10건)] ===")
for item in res['checksum_errors']:
    lines.append(f"* [행 {item['row']} | {item['batch']}차] {item['name']} | 사업자: {item['biz_no']} | 법인번호: {item['corp_no']} -> {item['reason']}")

lines.append("\n=== [2. 법인등록번호 중복 (동일 법인번호 공유 3건)] ===")
for c_no, occs in res['duplicate_corp_nos'].items():
    lines.append(f"* 법인번호 [{c_no}]:")
    for occ in occs:
        lines.append(f"  - 행 {occ['row']} ({occ['batch']}차): {occ['name']} (사업자: {occ['biz_no']})")

lines.append("\n=== [3. 법인 형태 상호명인데 '법인번호가 빠진(누락된)' 기업 (12건)] ===")
for item in res['missing_corp_for_corporations']:
    lines.append(f"* [행 {item['row']} | {item['batch']}차] {item['name']} (사업자: {item['biz_no']})")

lines.append("\n=== [4. 컬럼 밀림 의심 (법인번호 칸에 텍스트 입력 1건)] ===")
for item in res['column_shift_suspects']:
    lines.append(f"* [행 {item['row']}] {item['name']} -> 법인번호칸 내용: {item['corp_no']} ({item['reason']})")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\corp_audit_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("corp_audit_report.txt written successfully.")
