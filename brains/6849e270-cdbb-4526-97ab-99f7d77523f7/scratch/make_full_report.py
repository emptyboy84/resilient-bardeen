import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\full_1000_audit.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

lines = []
lines.append("================================================================================")
lines.append("                     전체 1,000행(959건) 데이터 전수 검증 종합 보고서")
lines.append("================================================================================\n")

lines.append("■ 1. 기본 현황 요약")
lines.append(f"  - 총 검증 데이터 건수: {res['total_count']}건 (1차 입력: {res['batch_breakdown']['1차']}건 / 2차 입력: {res['batch_breakdown']['2차']}건)")
lines.append(f"  - 사업자 상태: 정상 영업 {res['status_breakdown']['정상']}건 (91.3%), 폐업 {res['status_breakdown']['폐업']}건 (8.2%), 휴업 {res['status_breakdown']['휴업']}건 (0.4%)")
lines.append(f"  - 사업자등록번호 오류(체크섬/자릿수): {len(res['biz_no_errors'])}건")
lines.append(f"  - 법인등록번호 오류(체크섬): {len(res['corp_no_errors'])}건")
lines.append(f"  - 법인기업 중 법인번호 누락: {len(res['corp_no_missing_for_corps'])}건")
lines.append(f"  - 중복 사업자번호: {len(res['biz_no_duplicates'])}건")
lines.append(f"  - 동일 상호명 중복: {len(res['company_name_duplicates'])}건")
lines.append(f"  - 필수 정보(대표자/주소/업종) 누락: {len(res['critical_missing'])}건")
lines.append(f"  - 컬럼 밀림 및 서식 오류: {len(res['column_count_errors'])}건\n")

lines.append("■ 2. [사업자등록번호] 오류 목록 (34건)")
for item in res['biz_no_errors']:
    lines.append(f"  * [행 {item['row']:3d} | {item['batch']}차] {item['name']:25s} (사업자: {item['biz_no']}) -> {item['reason']}")

lines.append("\n■ 3. [법인등록번호] 오류 목록 (10건)")
for item in res['corp_no_errors']:
    lines.append(f"  * [행 {item['row']:3d} | {item['batch']}차] {item['name']:25s} (법인번호: {item['corp_no']}) -> {item['reason']}")

lines.append("\n■ 4. [법인기업인데 법인번호가 누락된 목록] (11건)")
for item in res['corp_no_missing_for_corps']:
    lines.append(f"  * [행 {item['row']:3d} | {item['batch']}차] {item['name']:30s} (사업자: {item['biz_no']})")

lines.append("\n■ 5. [중복 사업자번호 및 상호명]")
lines.append("  [중복 사업자등록번호]")
for b_no, occs in res['biz_no_duplicates'].items():
    lines.append(f"  * 사업자번호 [{b_no}]:")
    for occ in occs:
        lines.append(f"    - 행 {occ['row']:3d} ({occ['batch']}차 입력): {occ['name']}")
lines.append("  [동일 상호명 중복]")
for c_name, occs in res['company_name_duplicates'].items():
    lines.append(f"  * 상호명 [{c_name}]:")
    for occ in occs:
        lines.append(f"    - 행 {occ['row']:3d} ({occ['batch']}차 입력): {occ['name']} (사업자: {occ['biz_no']})")

lines.append("\n■ 6. [필수 항목 누락 목록] (영업 중 기업)")
for item in res['critical_missing']:
    lines.append(f"  * [행 {item['row']:3d} | {item.get('batch', 0)}차] {item.get('name', '(공란)'):25s} -> {item.get('field', '')}")

if res['industry_missing']:
    lines.append("\n■ 7. [업종 분류 전체 누락 목록]")
    for item in res['industry_missing']:
        lines.append(f"  * [행 {item['row']:3d} | {item['batch']}차] {item['name']}")

if res['email_errors'] or res['fax_errors'] or res['phone_errors'] or res['url_errors'] or res['emp_errors']:
    lines.append("\n■ 8. [연락처 및 서식 형식 오류]")
    for item in res['email_errors']:
        lines.append(f"  * [행 {item['row']:3d}] {item['name']} 이메일 오류: {item['email']} ({item['reason']})")
    for item in res['fax_errors']:
        lines.append(f"  * [행 {item['row']:3d}] {item['name']} 팩스번호 오류: {item['fax']} ({item['reason']})")
    for item in res['phone_errors']:
        lines.append(f"  * [행 {item['row']:3d}] {item['name']} 전화번호 오류: {item['phone']} ({item['reason']})")
    for item in res['url_errors']:
        lines.append(f"  * [행 {item['row']:3d}] {item['name']} URL 오류: {item['url']} ({item['reason']})")

if res['truncated_rows']:
    lines.append("\n■ 9. [입력 잘림(Truncated) 행]")
    for item in res['truncated_rows']:
        lines.append(f"  * [행 {item['row']:3d}] {item['name']} -> {item['raw']}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\full_1000_audit_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Saved full_1000_audit_report.txt successfully.")
