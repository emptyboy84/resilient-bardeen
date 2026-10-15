import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\clean_validation_results.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

print(f"=== [검증 통계 요약] ===")
print(f"- 총 데이터 건수: {res['total_count']}건 (1차 입력: {res['batch1_count']}건, 2차 입력: {res['batch2_count']}건)")
print(f"- 사업 상태: 정상 {res['status_stats']['정상']}건, 폐업 {res['status_stats']['폐업']}건, 휴업 {res['status_stats']['휴업']}건")
print(f"- 사업자번호 오류(체크섬/자릿수): {len(res['biz_no_errors'])}건")
print(f"- 중복 사업자등록번호: {len(res['biz_no_duplicates'])}건")
print(f"- 중복 회사명: {len(res['company_duplicates'])}건")
print(f"- 필수 정보 누락(영업 중 기업 기준): {len(res['critical_missing'])}건")
print(f"- 컬럼 수 불일치(18개 컬럼 초과/미만): {len(res['column_mismatches'])}건")
print(f"- 이메일 형식 오류: {len(res['email_errors'])}건")
print(f"- 전화번호 형식 오류: {len(res['phone_errors'])}건")
print(f"- 우편번호 형식 오류: {len(res['zip_errors'])}건")
print(f"- 법인번호 형식 오류: {len(res['corp_no_errors'])}건")
print(f"- 입력 잘림(Truncated) 행: {len(res['truncated_rows'])}건")

print("\n=== [1. 사업자번호 유효성 오류 목록] ===")
for item in res['biz_no_errors']:
    print(f"  * [행 {item['row']} | 배치 {item['batch']}] {item['name']} (사업자: {item['biz_no']}) -> {item['reason']}")

print("\n=== [2. 중복 사업자번호 목록] ===")
for b_no, occs in res['biz_no_duplicates'].items():
    print(f"  * 사업자번호 [{b_no}]:")
    for occ in occs:
        print(f"    - 행 {occ['row']} (배치 {occ['batch']}): {occ['name']}")

print("\n=== [3. 중복 회사명 목록] ===")
for name, occs in res['company_duplicates'].items():
    print(f"  * 회사명 [{name}]:")
    for occ in occs:
        print(f"    - 행 {occ['row']} (배치 {occ['batch']}): {occ['name']} (사업자: {occ['biz_no']})")

print("\n=== [4. 필수 정보 누락 목록 (영업 중 기업)] ===")
for item in res['critical_missing']:
    print(f"  * [행 {item['row']} | 배치 {item['batch']}] {item['name']} (사업자: {item['biz_no']}) -> {', '.join(item['missing'])}")

print("\n=== [5. 컬럼 수 불일치 및 서식 오류 (주요 5건)] ===")
for item in res['column_mismatches'][:5]:
    print(f"  * [행 {item['row']} | 배치 {item['batch']}] 컬럼 수 {item['cols_count']}개 -> 원문: {item['raw'][:80]}...")

if res['email_errors']:
    print("\n=== [6. 이메일 형식 오류] ===")
    for item in res['email_errors']:
        print(f"  * [행 {item['row']}] {item['name']}: {item['email']} ({item['reason']})")

if res['truncated_rows']:
    print("\n=== [7. 입력 잘림 행] ===")
    for item in res['truncated_rows']:
        print(f"  * [행 {item['row']}] {item['name']} -> 원문: {item['raw']}")
