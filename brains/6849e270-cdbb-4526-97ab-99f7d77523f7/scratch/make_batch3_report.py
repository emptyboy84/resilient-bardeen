import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\check_batch3.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

lines = []
lines.append("================================================================================")
lines.append(f"        방금 올려주신 {len(items)}건 데이터 정밀 검증 결과 보고서")
lines.append("================================================================================\n")

normal_items = [i for i in items if i['status'] == '정상']
error_items = [i for i in items if i['status'] != '정상']

lines.append(f"■ 검증 요약: 총 {len(items)}건 중 [정상: {len(normal_items)}건] / [수정·확인 필요: {len(error_items)}건]\n")

lines.append("■ [확인 및 보완이 필요한 항목 목록]")
for item in error_items:
    err_str = ", ".join(item['errors'])
    lines.append(f"  * [{item['row']:2d}번째 행] {item['name']} (사업자: {item['biz_no']}) -> {err_str}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\batch3_korean_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Saved batch3_korean_report.txt")
