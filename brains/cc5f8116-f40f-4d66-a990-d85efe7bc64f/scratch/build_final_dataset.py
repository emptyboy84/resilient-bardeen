import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load target 318
with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    targets = json.load(f)

# 2. Load 1st pass master_matches (186 confirmed)
with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json", "r", encoding="utf-8") as f:
    master_186 = json.load(f)

# 3. Secondary confirmed matches (manually and tool-verified)
secondary_confirmed = {
    "1278": {
        "biz_no": "621-15-82249",
        "emp_cnt": 9,
        "ceo": "서금석",
        "est_year": 1993,
        "est_month": 12,
        "tel": "051-517-7548",
        "addr": "부산광역시 금정구 중앙대로 2008, 5층",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "1786": {
        "biz_no": "773-86-01800",
        "emp_cnt": 86,
        "ceo": "김경환",
        "est_year": 2020,
        "est_month": 8,
        "tel": "051-745-1250",
        "addr": "해운대구 우동 센텀4로 센텀시티 몰",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "official_verified"
    },
    "1789": {
        "biz_no": "102-81-11670",
        "emp_cnt": 2061,
        "ceo": "허정도",
        "est_year": 1980,
        "est_month": 12,
        "tel": "051-709-5958",
        "addr": "해운대구 좌동 해운대로 NC백화점",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "official_verified"
    },
    "1804": {
        "biz_no": "621-85-37733",
        "emp_cnt": "", # Bizno has no employee count for this branch -> keep empty
        "ceo": "김상현",
        "est_year": "",
        "est_month": "",
        "tel": "051-901-2130",
        "addr": "부산광역시 기장군 기장읍 기장해안로 147, 3층",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "1811": {
        "biz_no": "106-81-86950",
        "emp_cnt": 170,
        "ceo": "YAMAMICHI FUMIAKI",
        "est_year": 2000,
        "est_month": 3,
        "tel": "051-745-1468",
        "addr": "해운대구 우동 센텀4로 센텀시티 몰",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "1812": {
        "biz_no": "126-81-25525",
        "emp_cnt": 58,
        "ceo": "마르코일린칙",
        "est_year": 1984,
        "est_month": 1,
        "tel": "051-745-1927",
        "addr": "해운대구 우동 센텀4로 센텀시티 몰",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "1956": {
        "biz_no": "102-81-19177",
        "emp_cnt": 26,
        "ceo": "김용섭",
        "est_year": 1995,
        "est_month": 7,
        "tel": "051-851-0114",
        "addr": "금정구 금사동 반송로",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "1964": {
        "biz_no": "102-81-11670",
        "emp_cnt": 2061,
        "ceo": "허정도",
        "est_year": 1980,
        "est_month": 12,
        "tel": "051-624-9961",
        "addr": "남구 대연동 수영로 리마크빌대연 A",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "official_verified"
    },
    "1986": {
        "biz_no": "102-81-11670",
        "emp_cnt": 2061,
        "ceo": "허정도",
        "est_year": 1980,
        "est_month": 12,
        "tel": "051-806-3501",
        "addr": "부산진구 부전동 중앙대로 교보생명",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "official_verified"
    },
    "2023": {
        "biz_no": "368-87-01231",
        "emp_cnt": 3,
        "ceo": "박범신",
        "est_year": 2021,
        "est_month": "",
        "tel": "051-904-9339",
        "addr": "부산광역시 해운대구 세실로 45 대승프라자 901호",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2057": {
        "biz_no": "102-81-11670",
        "emp_cnt": 2061,
        "ceo": "허정도",
        "est_year": 1980,
        "est_month": 12,
        "tel": "051-638-9961",
        "addr": "해운대구 우동 센텀남대로 롯데백화점센텀시티점",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "official_verified"
    },
    "2063": {
        "biz_no": "887-25-01165",
        "emp_cnt": "", # No emp count on bizno
        "ceo": "박현지",
        "est_year": "",
        "est_month": "",
        "tel": "010-3228-8668",
        "addr": "부산광역시 기장군 기장읍 동관광7로 17",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2075": {
        "biz_no": "214-87-95150",
        "emp_cnt": 98,
        "ceo": "유태연",
        "est_year": 2006,
        "est_month": 8,
        "tel": "010-5150-1937",
        "addr": "해운대구 수영강변대로 140, 9층 916호",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2078": {
        "biz_no": "314-81-41684",
        "emp_cnt": 228,
        "ceo": "최종윤",
        "est_year": 2001,
        "est_month": 5,
        "tel": "051-714-1076",
        "addr": "부산광역시 해운대구 재송동 센텀북대로 60 센텀IS타워 508",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2185": {
        "biz_no": "528-88-00923",
        "emp_cnt": 8,
        "ceo": "이성웅",
        "est_year": 2018,
        "est_month": 2,
        "tel": "010-4588-2794",
        "addr": "부산광역시 북구 만덕3로 34-1",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2217": {
        "biz_no": "255-81-03509",
        "emp_cnt": 1,
        "ceo": "고진호",
        "est_year": 2017,
        "est_month": 3,
        "tel": "",
        "addr": "부산광역시 해운대구 석대동 634번지 6층",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    },
    "2307": {
        "biz_no": "606-16-43962",
        "emp_cnt": 1,
        "ceo": "이현철",
        "est_year": 2014,
        "est_month": 8,
        "tel": "010-2875-1813",
        "addr": "부산광역시 연제구 월드컵대로114번길 26 (연산동)",
        "cand_status": "계속사업자",
        "closed_date": "",
        "source": "bizno_verified"
    }
}

final_dataset = {}
matched_count = 0
closed_count = 0
unmatched_count = 0

for t in targets:
    r_key = str(t['row'])
    
    # Priority 1: Secondary confirmed
    if r_key in secondary_confirmed:
        info = secondary_confirmed[r_key]
        final_dataset[r_key] = {
            "row": t['row'],
            "name": t['name'],
            "status": "matched",
            "biz_no": info['biz_no'],
            "emp_cnt": info['emp_cnt'], # Strict bizno rule
            "ceo": info['ceo'] if info['ceo'] else t.get('ceo', ''),
            "est_year": info['est_year'] if info['est_year'] else t.get('est_year', ''),
            "est_month": info['est_month'] if info['est_month'] else t.get('est_month', ''),
            "tel": info['tel'] if info['tel'] else t.get('tel', ''),
            "addr": info['addr'] if info['addr'] else t.get('addr', ''),
            "cand_status": info['cand_status'],
            "closed_date": info['closed_date'],
            "sales_24": "",
            "sales_25": "",
            "source": info['source']
        }
        matched_count += 1
        
    # Priority 2: 1st pass master_matches (if matched)
    elif r_key in master_186 and master_186[r_key].get('status') == 'matched':
        m = master_186[r_key]
        final_dataset[r_key] = {
            "row": t['row'],
            "name": t['name'],
            "status": "matched",
            "biz_no": m['biz_no'],
            "emp_cnt": m.get('emp_cnt', ''), # Strict bizno rule
            "ceo": m.get('ceo', '') if m.get('ceo') else t.get('ceo', ''),
            "est_year": m.get('est_year', '') if m.get('est_year') else t.get('est_year', ''),
            "est_month": m.get('est_month', '') if m.get('est_month') else t.get('est_month', ''),
            "tel": m.get('tel', '') if m.get('tel') else t.get('tel', ''),
            "addr": m.get('addr', '') if m.get('addr') else t.get('addr', ''),
            "cand_status": m.get('cand_status', ''),
            "closed_date": m.get('closed_date', ''),
            "sales_24": "",
            "sales_25": "",
            "source": m.get('source', 'bizno')
        }
        matched_count += 1
        if m.get('closed_date') or m.get('cand_status') == '폐업자':
            closed_count += 1
            
    # Priority 3: Unmatched / Unknown
    else:
        final_dataset[r_key] = {
            "row": t['row'],
            "name": t['name'],
            "status": "unmatched",
            "biz_no": "",
            "emp_cnt": "",
            "ceo": t.get('ceo', ''),
            "est_year": t.get('est_year', ''),
            "est_month": t.get('est_month', ''),
            "tel": t.get('tel', ''),
            "addr": t.get('addr', ''),
            "cand_status": "",
            "closed_date": "",
            "sales_24": "",
            "sales_25": "",
            "source": "none"
        }
        unmatched_count += 1

print(f"Total Target Rows: {len(targets)}")
print(f"Matched & Verified: {matched_count} rows")
print(f"  - of which closed: {closed_count} rows")
print(f"Unmatched / Left blank for safety: {unmatched_count} rows")

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\final_318_resolved.json", "w", encoding="utf-8") as f:
    json.dump(final_dataset, f, ensure_ascii=False, indent=2)

print("\nFinal dataset saved to final_318_resolved.json")
