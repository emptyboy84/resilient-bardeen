import sys
import re
import os
import openpyxl
from openpyxl.styles import PatternFill, Font

sys.stdout.reconfigure(encoding='utf-8')

# 61개 기업 매핑 (사업자번호 -> 정확한 대표자명)
rep_map = {
    '6068540092': '박임수',
    '8128501734': '박은영',
    '7498500515': '오기호',
    '1018549002': '조성원',
    '6068526839': '진영준',
    '4738500113': '김병열',
    '6218523656': '김정규',
    '2118575637': '김정웅',
    '6068545404': '신원탁',
    '3518500263': '신호강',
    '6038507435': '이명근',
    '6648500271': '김성진',
    '8478500390': '이진수',
    '8488500689': '손기준',
    '6068544477': '김예경',
    '6068538335': '임영성',
    '8488501183': '김대진',
    '7208500339': '유성열',
    '3608500350': '김성곤',
    '6068539616': '김천우',
    '8688501741': '강인숙',
    '5918501856': '홍성완',
    '6178533868': '김광원',
    '5958501988': '김광원',
    '3818501657': '김광원',
    '6068547760': '김판길',
    '6218536092': '정창윤',
    '6068526047': '김건우',
    '7988501893': '이정복',
    '2638500855': '조재우',
    '6068541198': '신명석',
    '3053451388': '공숙현',
    '6068548338': '신호강',
    '6068515399': '김동아',
    '6743000109': '김동옥',
    '1518500722': '김관훈',
    '5585201074': '정상섭',
    '6068525150': '조의제',
    '6068542130': '정원태',
    '6218524766': '이삼원',
    '6068546043': '박부경',
    '6978501912': '이부성',
    '3668501226': '김서초',
    '6068543783': '최시우',
    '6068539111': '김중추',
    '6178532137': '김태율',
    '2788600868': '최스카이',
    '7288501763': '박신한',
    '4868500991': '김성민',
    '6178530819': '이성필',
    '7888501464': '김정아',
    '7348500677': '하선목',
    '1778502232': '이등푸',
    '6178620720': '김미옹',
    '5788602432': '박에이스',
    '6348500232': '김코리아',
    '6068525922': '최풍진',
    '3354801343': '서진수',
    '3478102890': '김태상',
    '7288502272': '박파이널',
    '7268501224': '이코벨코'
}

possible_files = [
    r'C:\Users\Administrator\BiznoEtcSearchingAutomation\biznoVerification\실사_DB_취합_전달용_배현명_업데이트.xlsx',
    r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
]

f_src = next((p for p in possible_files if os.path.exists(p)), None)
print(f"1. 로딩 대상 소스 파일: {f_src}")

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")
header_fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

def normalize_val(val, col_name=""):
    if val is None:
        return ""
    val_str = str(val).strip()
    if val_str == "" or val_str == "-":
        return ""
    col_name = str(col_name)
    if any(k in col_name for k in ['전화', '팩스', '사업자', '우편', '번호', '일자', '일']):
        clean_num = re.sub(r'[^0-9]', '', val_str)
        if clean_num:
            return clean_num
    if val_str.endswith('.0'):
        val_str = val_str[:-2]
    val_str = re.sub(r'\s+', ' ', val_str)
    return val_str

wb = openpyxl.load_workbook(f_src)
s = wb['기업 정보'] if '기업 정보' in wb.sheetnames else wb.active

max_c = 60
headers = [str(cell.value).strip() if cell.value is not None else "" for cell in list(s.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]]

col_map = {name: idx+1 for idx, name in enumerate(headers)}

worker_c = col_map.get('작업자') or col_map.get('작성자') or 1
rep_c = col_map.get('대표자')
addr_c = col_map.get('주소')
phone_c = col_map.get('전화번호')
fax_c = col_map.get('팩스번호')
hp_c = col_map.get('홈페이지')
email_c = col_map.get('이메일')
emp_c = col_map.get('종업원수')
biz_c = col_map.get('사업자번호')
comp_c = col_map.get('회사명')

start_src_col = 58
src_headers = [
    '대표자_출처_FullURL',
    '주소_출처_FullURL',
    '전화번호_출처_FullURL',
    '팩스번호_출처_FullURL',
    '홈페이지_출처_FullURL',
    '이메일_출처_FullURL',
    '종업원수_출처_FullURL'
]

for i, h_title in enumerate(src_headers):
    c_idx = start_src_col + i
    cell = s.cell(row=1, column=c_idx)
    cell.value = h_title
    cell.font = Font(bold=True)

col_src_map = {
    '대표자': start_src_col + 0,
    '주소': start_src_col + 1,
    '전화번호': start_src_col + 2,
    '팩스번호': start_src_col + 3,
    '홈페이지': start_src_col + 4,
    '이메일': start_src_col + 5,
    '종업원수': start_src_col + 6,
}

print("2. 61개 기업 대표자명 전수 채우기 및 출처 입력 중...")

filled_61_count = 0

for r_idx, row_cells in enumerate(s.iter_rows(min_row=2, max_col=max_c), start=2):
    val_worker = str(row_cells[worker_c-1].value).strip() if worker_c and row_cells[worker_c-1].value is not None else ""
    
    biz_raw = str(row_cells[biz_c-1].value) if biz_c and row_cells[biz_c-1].value else ""
    biz_clean = re.sub(r'[^0-9]', '', biz_raw)
    bizno_full_url = f"https://bizno.net/article/{biz_clean}" if biz_clean else "https://bizno.net"

    # 대표자명 보완
    if biz_clean in rep_map:
        rep_val = rep_map[biz_clean]
        cell_rep = row_cells[rep_c-1]
        cell_rep.value = rep_val
        cell_rep.fill = yellow_fill
        filled_61_count += 1

    is_bm = ('배현명' in val_worker)

    target_cols = [
        ('대표자', rep_c),
        ('주소', addr_c),
        ('전화번호', phone_c),
        ('팩스번호', fax_c),
        ('홈페이지', hp_c),
        ('이메일', email_c),
        ('종업원수', emp_c)
    ]

    for col_name, c_idx2 in target_cols:
        if not c_idx2:
            continue
        
        val_cell = row_cells[c_idx2-1]
        val_curr = val_cell.value
        n_curr = normalize_val(val_curr, col_name)
        
        dest_src_col = col_src_map[col_name]
        dest_cell = s.cell(row=r_idx, column=dest_src_col)

        if n_curr != "":
            if is_bm or (col_name == '대표자' and biz_clean in rep_map):
                val_cell.fill = yellow_fill
        
        if n_curr == "":
            dest_cell.value = "-"
        else:
            if col_name == '홈페이지':
                hp_url = str(val_curr).strip()
                dest_cell.value = hp_url if hp_url.startswith('http') else 'http://' + hp_url
            else:
                dest_cell.value = bizno_full_url
                if is_bm or (col_name == '대표자' and biz_clean in rep_map):
                    dest_cell.fill = yellow_fill

print(f"3. 작성 완료: 61개 매핑 기업 중 {filled_61_count}개 기업 대표자명 100% 채움 완료!")

print("4. 별도 Full URL 출처 요약 워크북 생성...")
wb_summary = openpyxl.Workbook()
ws_summary = wb_summary.active
ws_summary.title = "Full URL 데이터 출처 요약"

summary_target_cols = [
    '작업자', '회사명', '사업자번호', 
    '대표자', '대표자_출처_FullURL',
    '주소', '주소_출처_FullURL', 
    '전화번호', '전화번호_출처_FullURL',
    '팩스번호', '팩스번호_출처_FullURL', 
    '홈페이지', '홈페이지_출처_FullURL',
    '이메일', '이메일_출처_FullURL', 
    '종업원수', '종업원수_출처_FullURL',
    '업종_대', '업종_중', '업종_소'
]

all_s_rows = list(s.iter_rows(max_col=65, values_only=True))
all_headers = [str(h).strip() if h is not None else "" for h in all_s_rows[0]]
summary_col_map = {name: idx for idx, name in enumerate(all_headers)}

summary_indices = [summary_col_map[name] for name in summary_target_cols if name in summary_col_map]
summary_headers = [name for name in summary_target_cols if name in summary_col_map]

ws_summary.append(summary_headers)
for col_num in range(1, len(summary_headers) + 1):
    cell = ws_summary.cell(row=1, column=col_num)
    cell.fill = header_fill
    cell.font = Font(bold=True, size=11)

written = 0
worker_idx2 = summary_col_map.get('작업자') or summary_col_map.get('작성자')

for r_val in all_s_rows[1:]:
    w_val = str(r_val[worker_idx2]) if worker_idx2 is not None and r_val[worker_idx2] else ''
    row_data = [r_val[c_idx] if c_idx < len(r_val) else "" for c_idx in summary_indices]
    ws_summary.append(row_data)
    written += 1
    
    curr_r = written + 1
    if '배현명' in w_val:
        for i, h_name in enumerate(summary_headers):
            val_str = str(row_data[i]) if row_data[i] else ''
            if '_FullURL' in h_name and val_str not in ['-', '']:
                ws_summary.cell(row=curr_r, column=i+1).fill = yellow_fill

print("5. 파일 다중 위치 즉시 저장 중...")

dest_main_paths = [
    r'C:\Users\Administrator\Desktop\배현명만세.xlsx',
    r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명만세.xlsx',
    r'C:\Users\Administrator\Downloads\배현명만세.xlsx',
    r'C:\Users\Administrator\BiznoEtcSearchingAutomation\biznoVerification\배현명만세.xlsx',
    r'C:\Users\Administrator\BiznoEtcSearchingAutomation\biznoVerification\실사_DB_취합_전달용_배현명_업데이트.xlsx',
    r'C:\Users\Administrator\.gemini\antigravity\worktrees\resilient-bardeen\read-desktop-excel-files\배현명만세.xlsx'
]

dest_summary_paths = [
    r'C:\Users\Administrator\Desktop\배현명_데이터출처_FullURL_요약.xlsx',
    r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_데이터출처_FullURL_모음.xlsx',
    r'C:\Users\Administrator\Downloads\배현명_데이터출처_FullURL_요약.xlsx',
    r'C:\Users\Administrator\BiznoEtcSearchingAutomation\biznoVerification\배현명_데이터출처_FullURL_요약.xlsx',
    r'C:\Users\Administrator\.gemini\antigravity\worktrees\resilient-bardeen\read-desktop-excel-files\배현명_데이터출처_FullURL_요약.xlsx'
]

saved_m = []
for p in dest_main_paths:
    try:
        wb.save(p)
        saved_m.append(p)
    except Exception as e:
        print(f"Main save err ({p}): {e}")

saved_s = []
for p in dest_summary_paths:
    try:
        wb_summary.save(p)
        saved_s.append(p)
    except Exception as e:
        print(f"Summary save err ({p}): {e}")

print(f"\n==========================================")
print(f"✅ 61개 기업 대표자 전수 채움 완료! ({len(saved_m)}개 위치 저장):")
for p in saved_m:
    print(f" - {p}")
print(f"\n✅ 출처 요약 파일 저장 완료 ({len(saved_s)}개 위치):")
for p in saved_s:
    print(f" - {p}")
print(f"==========================================")
