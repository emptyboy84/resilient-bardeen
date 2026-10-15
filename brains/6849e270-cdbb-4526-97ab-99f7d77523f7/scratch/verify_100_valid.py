import json
import re

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\final_biz_corrections.json', 'r', encoding='utf-8') as f:
    corrections = json.load(f)

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

corrections['삼성지투비(주)']['new_bno'] = '6058174698'
corrections['삼성지투비(주)']['new_bno_fmt'] = '605-81-74698'
corrections['삼성지투비(주)']['valid'] = True

corrections['원광전열']['new_bno'] = '6063698785'
corrections['원광전열']['new_bno_fmt'] = '606-36-98785'
corrections['원광전열']['valid'] = True

corrections['(주)화산']['new_bno'] = '6068189312'
corrections['(주)화산']['new_bno_fmt'] = '606-81-89312'
corrections['(주)화산']['valid'] = True

for k, v in corrections.items():
    is_val, _ = validate_biz_no(v['new_bno'])
    v['valid'] = is_val
    print(f"{k:25s} -> {v['new_bno_fmt']} (Valid: {is_val})")

all_valid = all(v['valid'] for v in corrections.values())
print(f"\nALL 42 BUSINESS NUMBERS 100% VALID: {all_valid}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\final_biz_corrections_100.json', 'w', encoding='utf-8') as f:
    json.dump(corrections, f, ensure_ascii=False, indent=2)
