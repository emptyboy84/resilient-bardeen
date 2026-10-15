import json
import re

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\resolved_biz_numbers.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

def validate_biz_no(val):
    clean = re.sub(r'[^0-9]', '', str(val))
    if len(clean) != 10:
        return False, clean
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(8))
    s += (digits[8] * 5) // 10 + (digits[8] * 5) % 10
    chk = (10 - (s % 10)) % 10
    return digits[9] == chk, clean

corrections = {}

for it in items:
    name = it['name']
    old_b = it['old_bno']
    new_b = it['new_bno']
    
    # Manual overrides for confirmed ground truths
    if '대성이앤지' in name:
        new_b = '606-86-35543'
    elif '진영노즐' in name:
        new_b = '421-88-00340'
    elif '토마토전자' in name:
        new_b = '605-81-62528'
    elif '삼성지투비' in name:
        new_b = '605-81-74690' # 6085817469 -> 605-81-74690 (부산진구 법인번호 180111-0536061)
    elif '화산' in name:
        new_b = '606-81-89311' # 6068189316 -> 6068189311 (기장군 기장읍 청강로74번길 50)
    elif '원광전열' in name:
        new_b = '606-36-98782' # 6063698788 -> 6063698782 (강서구 유통단지1로57번길 34)
    elif '비엔아이' in name:
        new_b = '606-37-39691' # 부산 북구/사상구 비엔아이
        
    clean_new = re.sub(r'[^0-9]', '', str(new_b))
    is_val, _ = validate_biz_no(clean_new)
    
    corrections[name] = {
        'old_bno': old_b,
        'new_bno': clean_new,
        'new_bno_fmt': f"{clean_new[:3]}-{clean_new[3:5]}-{clean_new[5:]}" if len(clean_new) == 10 else clean_new,
        'valid': is_val
    }

print(f"Total mapped corrections: {len(corrections)}")
invalid_count = sum(1 for c in corrections.values() if not c['valid'])
print(f"Invalid count after correction: {invalid_count}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\final_biz_corrections.json', 'w', encoding='utf-8') as f:
    json.dump(corrections, f, ensure_ascii=False, indent=2)

for k, v in corrections.items():
    print(f"{k:25s} | 기존:{v['old_bno']:10s} -> 수정:{v['new_bno_fmt']:12s} (체크섬검증:{v['valid']})")
