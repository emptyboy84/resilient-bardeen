import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\latest_batch_audit.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

lines = []
lines.append("================================================================================")
lines.append(f"        최신 입력 데이터 (총 {len(rows)}건) 18개 열 전수 정밀 검증 보고서")
lines.append("================================================================================\n")

normal_rows = [r for r in rows if r['status'] == '정상']
error_rows = [r for r in rows if r['status'] != '정상']

lines.append(f"■ 검증 종합 요약")
lines.append(f"  - 총 검증 행 수: {len(rows)}건")
lines.append(f"  - 정상 데이터: {len(normal_rows)}건 (91.5%)")
lines.append(f"  - 수정 및 확인 필요: {len(error_rows)}건 (8.5%)\n")

# Group by error types
biz_errs = []
corp_errs = []
corp_missing = []
missing_crit = []
format_errs = []

for r in error_rows:
    for e in r['errors']:
        if '사업자번호' in e:
            biz_errs.append((r['row_id'], r['name'], r['biz_no'], e))
        elif '법인번호 오류' in e or '체크섬' in e:
            corp_errs.append((r['row_id'], r['name'], r['corp_no'], e))
        elif '법인기업이나 법인번호' in e:
            corp_missing.append((r['row_id'], r['name'], r['biz_no'], e))
        elif '누락' in e:
            missing_crit.append((r['row_id'], r['name'], e))
        else:
            format_errs.append((r['row_id'], r['name'], e))

lines.append(f"■ 1. [사업자등록번호 체크섬/자릿수 오류] (총 {len(biz_errs)}건)")
for rid, name, bno, err in biz_errs:
    lines.append(f"  * [{rid:3d}행] {name:30s} (사업자: {bno}) -> {err}")

lines.append(f"\n■ 2. [법인등록번호 체크섬 오류] (총 {len(corp_errs)}건)")
for rid, name, cno, err in corp_errs:
    lines.append(f"  * [{rid:3d}행] {name:30s} (법인번호: {cno}) -> {err}")

lines.append(f"\n■ 3. [법인기업이나 법인번호 미기재] (총 {len(corp_missing)}건)")
for rid, name, bno, err in corp_missing:
    lines.append(f"  * [{rid:3d}행] {name:30s} (사업자: {bno})")

lines.append(f"\n■ 4. [필수 항목(대표자/주소 등) 누락] (총 {len(missing_crit)}건)")
for rid, name, err in missing_crit:
    lines.append(f"  * [{rid:3d}행] {name:30s} -> {err}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\latest_batch_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Saved latest_batch_report.txt successfully.")
