import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\validation_result.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

print("=== 1. 컬럼 개수 불일치 (Column Shift/Missing Delimiters) ===")
for item in res['column_count_mismatch'][:15]:
    print(f"[행 {item['row']}] 컬럼 수: {item['cols_count']} / 내용: {item['raw'][:80]}...")

print("\n=== 2. 사업자등록번호 오류 (자릿수 및 체크섬) ===")
for item in res['invalid_biz_no']:
    print(f"[행 {item['row']}] {item['name']} | 사업자번호: {item['biz_no']} | 사유: {item['reason']}")

print("\n=== 3. 중복 사업자등록번호 ===")
for item in res['duplicate_biz_no']:
    print(f"사업자번호 {item['biz_no']} 중복:")
    for occ in item['occurrences']:
        print(f"  - 행 {occ[0]}: {occ[1]} (배치 {occ[2]})")

print("\n=== 4. 중복 회사명 ===")
for item in res['duplicate_company']:
    print(f"회사명 [{item['clean_name']}] 중복:")
    for occ in item['occurrences']:
        print(f"  - 행 {occ[0]}: {occ[1]} (사업자: {occ[2]}, 배치 {occ[3]})")

print("\n=== 5. 필수 정보 누락 (영업 중 기업 기준) ===")
for item in res['missing_critical']:
    print(f"[행 {item['row']}] {item['name']} (사업자: {item['biz_no']}) -> {', '.join(item['missing'])}")

print("\n=== 6. 이메일/법인번호/기타 오류 ===")
for item in res['invalid_emails']:
    print(f"이메일 오류: [행 {item['row']}] {item['name']} -> {item['email']} ({item['reason']})")
for item in res['invalid_corps']:
    print(f"법인번호 오류: [행 {item['row']}] {item['name']} -> {item['corp_no']} ({item['reason']})")

