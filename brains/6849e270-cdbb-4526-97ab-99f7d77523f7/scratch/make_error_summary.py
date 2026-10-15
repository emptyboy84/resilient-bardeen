import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\master_reupload_errors.json', 'r', encoding='utf-8') as f:
    errors = json.load(f)

# Group errors by category
biz_errs = [e for e in errors if e['col'] == '사업자번호']
corp_checksum_errs = [e for e in errors if e['col'] == '법인번호' and '체크섬' in e['msg']]
corp_missing_errs = [e for e in errors if e['col'] == '법인번호' and '미기재' in e['msg']]
ceo_missing_errs = [e for e in errors if e['col'] == '대표자']
addr_missing_errs = [e for e in errors if e['col'] == '주소']
settle_missing_errs = [e for e in errors if e['col'] == '결산월']
format_errs = [e for e in errors if e['col'] in ['전화번호', '팩스번호']]

print("=== RE-UPLOADED MASTER FILE ERROR BREAKDOWN ===")
print(f"1. 사업자번호 체크섬 오류: {len(biz_errs)}건")
print(f"2. 법인번호 체크섬 오류: {len(corp_checksum_errs)}건")
print(f"3. 법인기업 법인번호 미기재: {len(corp_missing_errs)}건")
print(f"4. 결산월 누락: {len(settle_missing_errs)}건")
print(f"5. 대표자명 누락: {len(ceo_missing_errs)}건")
print(f"6. 주소 누락: {len(addr_missing_errs)}건")
print(f"7. 전화/팩스 서식 및 오염: {len(format_errs)}건")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\error_breakdown_summary.txt', 'w', encoding='utf-8') as f:
    f.write("=== 새로 올리신 마스터 파일의 배현명 1000행 전체 오류 정밀 검사 결과 ===\n\n")
    
    f.write(f"■ 1. 사업자등록번호 체크섬 오류 (총 {len(biz_errs)}건)\n")
    for e in biz_errs:
        f.write(f"  * [행 {e['local_id']:3d} / 원본 {e['master_row']:4d}행] {e['name']:25s} -> {e['msg']}\n")
        
    f.write(f"\n■ 2. 법인등록번호 체크섬 오류 (총 {len(corp_checksum_errs)}건)\n")
    for e in corp_checksum_errs:
        f.write(f"  * [행 {e['local_id']:3d} / 원본 {e['master_row']:4d}행] {e['name']:25s} -> {e['msg']}\n")
        
    f.write(f"\n■ 3. 대표자명 누락 (총 {len(ceo_missing_errs)}건)\n")
    for e in ceo_missing_errs:
        f.write(f"  * [행 {e['local_id']:3d} / 원본 {e['master_row']:4d}행] {e['name']:25s} -> {e['msg']}\n")
        
    f.write(f"\n■ 4. 주소 누락 (총 {len(addr_missing_errs)}건)\n")
    for e in addr_missing_errs:
        f.write(f"  * [행 {e['local_id']:3d} / 원본 {e['master_row']:4d}행] {e['name']:25s} -> {e['msg']}\n")
        
    f.write(f"\n■ 5. 서식 및 따옴표 오염 (총 {len(format_errs)}건)\n")
    for e in format_errs:
        f.write(f"  * [행 {e['local_id']:3d} / 원본 {e['master_row']:4d}행] {e['name']:25s} -> {e['msg']}\n")

print("Saved error_breakdown_summary.txt successfully.")
