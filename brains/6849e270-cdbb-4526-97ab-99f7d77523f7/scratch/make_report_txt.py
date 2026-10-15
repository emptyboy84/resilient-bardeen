import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\clean_validation_results.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

lines = []
lines.append("=== [검증 통계 요약] ===")
lines.append(f"- 총 데이터 건수: {res['total_count']}건 (1차 입력: {res['batch1_count']}건, 2차 입력: {res['batch2_count']}건)")
lines.append(f"- 사업 상태: 정상 영업 {res['status_stats']['정상']}건, 폐업 {res['status_stats']['폐업']}건, 휴업 {res['status_stats']['휴업']}건")
lines.append(f"- 사업자번호 오류(체크섬/자릿수): {len(res['biz_no_errors'])}건")
lines.append(f"- 중복 사업자등록번호: {len(res['biz_no_duplicates'])}건")
lines.append(f"- 중복 회사명: {len(res['company_duplicates'])}건")
lines.append(f"- 필수 정보 누락(영업 중 기업 기준): {len(res['critical_missing'])}건")
lines.append(f"- 컬럼 수 불일치(18개 컬럼 초과/미만): {len(res['column_mismatches'])}건")
lines.append(f"- 이메일 형식 오류: {len(res['email_errors'])}건")
lines.append(f"- 입력 잘림(Truncated) 행: {len(res['truncated_rows'])}건")

lines.append("\n=== [1. 사업자번호 유효성 오류 목록] ===")
for item in res['biz_no_errors']:
    lines.append(f"* [행 {item['row']} | {item['batch']}차 입력] {item['name']} (사업자: {item['biz_no']}) -> {item['reason']}")

lines.append("\n=== [2. 중복 사업자번호 목록] ===")
for b_no, occs in res['biz_no_duplicates'].items():
    lines.append(f"* 사업자번호 [{b_no}]:")
    for occ in occs:
        lines.append(f"  - 행 {occ['row']} ({occ['batch']}차 입력): {occ['name']}")

lines.append("\n=== [3. 중복 회사명 목록] ===")
for name, occs in res['company_duplicates'].items():
    lines.append(f"* 회사명 [{name}]:")
    for occ in occs:
        lines.append(f"  - 행 {occ['row']} ({occ['batch']}차 입력): {occ['name']} (사업자: {occ['biz_no']})")

lines.append("\n=== [4. 필수 정보 누락 목록 (영업 중 기업)] ===")
for item in res['critical_missing']:
    lines.append(f"* [행 {item['row']} | {item['batch']}차 입력] {item['name']} (사업자: {item['biz_no']}) -> {', '.join(item['missing'])}")

lines.append("\n=== [5. 이메일 및 기타 형식 오류] ===")
for item in res['email_errors']:
    lines.append(f"* [행 {item['row']}] {item['name']}: {item['email']} ({item['reason']})")

if res['truncated_rows']:
    lines.append("\n=== [6. 입력 잘림 행] ===")
    for item in res['truncated_rows']:
        lines.append(f"* [행 {item['row']}] {item['name']} -> 원문: {item['raw']}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\validation_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("validation_report.txt written successfully.")
