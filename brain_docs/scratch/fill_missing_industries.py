import sys
import re
import urllib.request
import urllib.parse
import openpyxl
from openpyxl.styles import PatternFill

sys.stdout.reconfigure(encoding='utf-8')

f2 = r'C:\Users\Administrator\Desktop\배현명만세.xlsx'
f2_alt = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명만세.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

# 한국표준산업분류(KSIC 10/11차) 키워드 맵핑 규칙
def infer_ksic(industry_text, company_name=""):
    text = (str(industry_text) + " " + str(company_name)).strip()
    
    # 1. 도소매업 / 소매 / 도매 / 상사 / 무역
    if any(k in text for k in ['소매', '도매', '유통', '상사', '컴퓨터 및 주변장치', '가전제품', '통신기기', '슈퍼마켓', '마트', '쇼핑']):
        dae = '도매 및 소매업'
        if '소매' in text:
            jung = '소매업; 자동차 제외'
            so = '정보통신장비 소매업' if any(k in text for k in ['컴퓨터', '통신', '전자']) else '기타 상품 전문 소매업'
        else:
            jung = '도매 및 상품 중개업'
            so = '기계장비 및 관련 용품 도매업' if any(k in text for k in ['기계', '장비', '전자']) else '기타 전문 도매업'
        return dae, jung, so
        
    # 2. 제조업 / 생산 / 가공 / 공장 / 부품 / 장비
    if any(k in text for k in ['제조', '가공', '생산', '금속', '기계', '전자', '적층판', '인쇄회로', '정밀', '플라스틱', '사출', '금형', '테크', '산업', '철강']):
        dae = '제조업'
        if any(k in text for k in ['전자', 'IT', '컴퓨터', '회로', '반도체', '적층판']):
            jung = '전자부품, 컴퓨터, 영상, 음향 및 통신장비 제조업'
            so = '전자부품 제조업'
        elif any(k in text for k in ['금속', '철강', '주조', '열처리', '단조']):
            jung = '금속 가공제품 제조업; 기계 및 가구 제외'
            so = '기타 금속 가공제품 제조업'
        elif any(k in text for k in ['기계', '장비']):
            jung = '기타 기계 및 장비 제조업'
            so = '특수 목적용 기계 제조업'
        else:
            jung = '기타 제품 제조업'
            so = '기타 분류 안된 제품 제조업'
        return dae, jung, so
        
    # 3. 서비스 / 수리 / 개인서비스
    if any(k in text for k in ['수리', 'AS', '서비스', '세탁', '미용', '사우나', '헬스', '피트니스']):
        dae = '수리 및 기타 개인 서비스업'
        if '수리' in text:
            jung = '개인 및 가전제품 수리업'
            so = '컴퓨터 및 통신장비 수리업'
        else:
            jung = '기타 개인 서비스업'
            so = '욕탕업 및 기타 위생 서비스업'
        return dae, jung, so

    # 4. 숙박 및 음식점업
    if any(k in text for k in ['음식점', '식당', '주점', '카페', '베이커리', '준코', '두끼', '푸드']):
        dae = '숙박 및 음식점업'
        jung = '음식점 및 주점업'
        so = '일반 음식점업'
        return dae, jung, so

    # 5. 정보통신업 / IT / 소프트웨어
    if any(k in text for k in ['소프트웨어', '개발', 'SI', '시스템', '네트워크', '클라우드']):
        dae = '정보통신업'
        jung = '컴퓨터 프로그래밍, 시스템 통합 및 관리업'
        so = '소프트웨어 개발 및 공급업'
        return dae, jung, so

    # 6. 전문, 과학 및 기술 서비스업 / 세무 / 법무 / 노무 / 연구
    if any(k in text for k in ['세무', '노무', '법무', '연구', '컨설팅', '엔지니어링', '경영']):
        dae = '전문, 과학 및 기술 서비스업'
        jung = '법무 및 회계 관련 서비스업' if any(k in text for k in ['세무', '노무', '법무']) else '기타 전문, 과학 및 기술 서비스업'
        so = '회계 및 세무관련 서비스업' if '세무' in text else '경영 컨설팅 자문업'
        return dae, jung, so

    # 7. 교육 / 학원 / 체육 / 도서관 / 문화
    if any(k in text for k in ['도서관', '체육', '스포츠', '재단', '문화', '학원', '교육', '센터']):
        dae = '교육 서비스업'
        jung = '교육 서비스업'
        so = '기타 교육기관'
        return dae, jung, so

    # 8. 건설업
    if any(k in text for k in ['건설', '토목', '건축', '설비', '공사', '인테리어']):
        dae = '건설업'
        jung = '종합 건설업'
        so = '건물 건설업'
        return dae, jung, so

    # 기본값
    return '기타 서비스업', '기타 서비스업', '기타 서비스업'

print("1. 엑셀 파일 로딩 중...")
wb = openpyxl.load_workbook(f2)
s = wb['기업 정보']

max_c = 60
headers = [str(cell.value).strip() if cell.value is not None else "" for cell in list(s.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]]

col_map = {name: idx+1 for idx, name in enumerate(headers)}

idx_author = col_map.get('작성자')
idx_dae = col_map.get('업종_대')
idx_jung = col_map.get('업종_중')
idx_so = col_map.get('업종_소')
idx_comp = col_map.get('회사명')
idx_nice = col_map.get('업종(NICE BizINFO(업종)참고')

print("2. 업종_대 / 업종_중 / 업종_소 공란 자동 보완 시작...")

filled_dae = 0
filled_jung = 0
filled_so = 0

for r_idx, row in enumerate(s.iter_rows(min_row=2, max_col=max_c), start=2):
    author = str(row[idx_author-1].value) if idx_author and row[idx_author-1].value else ''
    if '배현명(7.20~)' in author:
        cell_dae = row[idx_dae-1] if idx_dae else None
        cell_jung = row[idx_jung-1] if idx_jung else None
        cell_so = row[idx_so-1] if idx_so else None
        
        comp_name = str(row[idx_comp-1].value) if idx_comp and row[idx_comp-1].value else ''
        nice_text = str(row[idx_nice-1].value) if idx_nice and row[idx_nice-1].value else ''
        
        # 공란 체크
        dae_empty = not cell_dae.value or str(cell_dae.value).strip() in ['-', '']
        jung_empty = not cell_jung.value or str(cell_jung.value).strip() in ['-', '']
        so_empty = not cell_so.value or str(cell_so.value).strip() in ['-', '']
        
        if dae_empty or jung_empty or so_empty:
            dae_val, jung_val, so_val = infer_ksic(nice_text, comp_name)
            
            if dae_empty and cell_dae:
                cell_dae.value = dae_val
                cell_dae.fill = yellow_fill
                filled_dae += 1
                
            if jung_empty and cell_jung:
                cell_jung.value = jung_val
                cell_jung.fill = yellow_fill
                filled_jung += 1
                
            if so_empty and cell_so:
                cell_so.value = so_val
                cell_so.fill = yellow_fill
                filled_so += 1

print(f"\n==========================================")
print(f"📊 업종 분류(대/중/소) 자동 보완 완료 통계")
print(f"==========================================")
print(f" - 🟡 업종_대 신규 채움: {filled_dae}개")
print(f" - 🟡 업종_중 신규 채움: {filled_jung}개")
print(f" - 🟡 업종_소 신규 채움: {filled_so}개")
print(f"==========================================")

print("3. 결과 파일 저장 중...")
wb.save(f2)
wb.save(f2_alt)
print(f"✅ 저장 완료:\n 1. {f2}\n 2. {f2_alt}")
