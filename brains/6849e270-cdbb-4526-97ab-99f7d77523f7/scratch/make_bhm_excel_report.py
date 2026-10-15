import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_excel_audit.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

lines = []
lines.append("================================================================================")
lines.append("        배현명 님 실사 DB 엑셀 파일 (정확히 1,000행) 전수 데이터 검증 결과 보고서")
lines.append("================================================================================\n")

lines.append("■ 1. 기본 현황 종합 요약")
lines.append(f"  - 대상 파일: C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx")
lines.append(f"  - 배현명 님 취합 데이터 총 건수: 정확히 {res['total_bhm_rows']}행")
lines.append(f"  - 사업자 상태: 정상 영업 {res['status_stats']['정상']}건 (91.4%), 폐업 {res['status_stats']['폐업']}건 (8.2%), 휴업 {res['status_stats']['휴업']}건 (0.4%)")
lines.append(f"  - 사업자등록번호 유효성(체크섬) 오류: {len(res['biz_no_errors'])}건 (4.7%)")
lines.append(f"  - 법인등록번호 유효성(체크섬) 오류: {len(res['corp_no_errors'])}건")
lines.append(f"  - 법인기업 중 법인번호 누락(공란): {len(res['corp_no_missing_for_corps'])}건")
lines.append(f"  - 중복 사업자등록번호: {len(res['biz_no_duplicates'])}건")
lines.append(f"  - 동일 상호명 중복: {len(res['company_name_duplicates'])}건")
lines.append(f"  - 필수 정보(대표자/주소 등) 누락: {len(res['critical_missing'])}건\n")

lines.append("■ 2. [사업자등록번호 유효성(체크섬) 오류 목록] (총 47건)")
for item in res['biz_no_errors']:
    lines.append(f"  * [엑셀 {item['excel_row']:4d}행] {item['name']:25s} (사업자: {item['biz_no']}) -> {item['reason']}")

lines.append("\n■ 3. [법인등록번호 유효성(체크섬) 오류 목록] (총 10건)")
for item in res['corp_no_errors']:
    lines.append(f"  * [엑셀 {item['excel_row']:4d}행] {item['name']:25s} (법인번호: {item['corp_no']}) -> {item['reason']}")

lines.append("\n■ 4. [법인기업인데 법인번호가 누락(공란)된 기업 목록] (총 12건)")
for item in res['corp_no_missing_for_corps']:
    lines.append(f"  * [엑셀 {item['excel_row']:4d}행] {item['name']:30s} (사업자: {item['biz_no']})")

lines.append("\n■ 5. [중복 데이터 현황]")
lines.append("  [중복 사업자등록번호]")
for b_no, occs in res['biz_no_duplicates'].items():
    lines.append(f"  * 사업자번호 [{b_no}]:")
    for occ in occs:
        lines.append(f"    - 엑셀 {occ['excel_row']:4d}행: {occ['name']}")
lines.append("  [동일 상호명 중복]")
for c_name, occs in res['company_name_duplicates'].items():
    lines.append(f"  * 상호명 [{c_name}]:")
    for occ in occs:
        lines.append(f"    - 엑셀 {occ['excel_row']:4d}행: {occ['name']} (사업자: {occ['biz_no']})")

lines.append("\n■ 6. [필수 항목(대표자/주소) 누락 기업 목록]")
for item in res['critical_missing']:
    lines.append(f"  * [엑셀 {item['excel_row']:4d}행] {item['name']:25s} -> {item['field']}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_excel_audit_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Saved bhm_excel_audit_report.txt successfully.")
