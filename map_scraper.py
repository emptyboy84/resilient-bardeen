import json
import re
import urllib.parse
import urllib.request
import time

def fetch_kakao_map(address):
    url = f"https://search.map.kakao.com/mapsearch/map.daum?callback=jQuery&q={urllib.parse.quote(address)}&msFlag=A&sort=0"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://map.kakao.com/'
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode('utf-8')
            match = re.search(r'jQuery\((.*)\)', body)
            if match:
                data = json.loads(match.group(1))
                return data.get('place', [])
            return []
    except Exception as e:
        print(f"Error fetching {address}: {e}")
        return []

def main():
    with open('input_data.txt', 'r', encoding='utf-8') as f:
        lines = f.read().strip().split('\n')

    output = []
    
    for i, line in enumerate(lines):
        parts = line.split('\t')
        if len(parts) < 5:
            continue
            
        original_comp = parts[1]
        addr = parts[4].strip()
        
        # 주소 문자열 정제 (괄호 안 내용이나 건물명 등 제거)
        clean_addr = re.sub(r'\(.*?\)', '', addr).split(',')[0].strip()
        
        places = fetch_kakao_map(clean_addr)
        time.sleep(0.5) # rate limit 방지
        
        found_manufacturers = []
        for p in places:
            cat = p.get('cateName', '')
            name = p.get('name', '')
            tel = p.get('tel', '')
            p_addr = p.get('address', '')
            
            # 제조업체 여부 판단 (카테고리명 또는 상호명에 제조, 공장, 정공, 기계, 테크, 중공업 등 포함)
            # 확실히 거르기보단, 검색된 업체의 카테고리를 그대로 표시해줍니다.
            if '제조' in cat or '공업' in cat or '산업' in cat or '테크' in cat or '정밀' in cat or '정공' in cat:
                found_manufacturers.append(f"{name} ({cat}) - {tel}")
            elif any(x in name for x in ['공장', '제조', '정공', '테크', '산업', '기계', '엔지니어링', '이엔지', '플랜트']):
                found_manufacturers.append(f"{name} ({cat}) - {tel}")
            elif '비지나우' not in name and '결번' not in name:
                # 애매한 경우도 다 추출하지만 우선 카테고리를 명시함
                found_manufacturers.append(f"{name} ({cat}) - {tel}")
                
        # 매칭 결과를 정리
        res = f"{original_comp}\t{addr}\n"
        if found_manufacturers:
            for fm in found_manufacturers:
                res += f"\t-> 발견: {fm}\n"
        else:
            res += f"\t-> 발견된 해당 주소지의 검색 업체가 없습니다.\n"
        output.append(res)
        
        print(f"Processed [{i+1}/{len(lines)}] {original_comp} at {clean_addr}")

    with open('output_results.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))
        
    print("완료되었습니다! 결과가 output_results.txt에 저장되었습니다.")

if __name__ == '__main__':
    main()
