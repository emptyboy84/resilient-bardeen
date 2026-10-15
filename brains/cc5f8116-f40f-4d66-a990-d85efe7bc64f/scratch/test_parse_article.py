import urllib.request
import urllib.parse
import re
import json

def parse_bizno_article(biz_no_10):
    url = f"https://bizno.net/article/{biz_no_10}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            # The meta description or table has the summary
            # Example: <meta name="description" content="...">
            desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html)
            desc = desc_match.group(1) if desc_match else ""
            
            # Parse fields from desc or html table
            # 대표자명 : (\S+)
            ceo_match = re.search(r'대표자명\s*:\s*([^\s<]+)', desc) or re.search(r'대표자명\s*</th>\s*<td[^>]*>(.*?)</td>', html)
            ceo = ceo_match.group(1).strip() if ceo_match else ""
            
            # 설립일(신고/인허가일) : (\d{4}-\d{2}-\d{2})
            est_match = re.search(r'설립일[^\:]*:\s*(\d{4})-(\d{2})-(\d{2})', desc) or re.search(r'설립일[^\:]*</th>\s*<td[^>]*>(\d{4})-(\d{2})-(\d{2})', html)
            est_year = est_match.group(1) if est_match else ""
            est_month = str(int(est_match.group(2))) if est_match else ""
            
            # 종업원수 : (\d+)명
            emp_match = re.search(r'종업원수\s*:\s*(\d+)명', desc) or re.search(r'종업원수\s*</th>\s*<td[^>]*>(\d+)명', html)
            emp_cnt = emp_match.group(1) if emp_match else ""
            
            # 사업자등록번호 : (\d{3}-\d{2}-\d{5})
            biz_match = re.search(r'사업자등록번호\s*:\s*(\d{3}-\d{2}-\d{5})', desc) or re.search(r'사업자등록번호\s*</th>\s*<td[^>]*>(\d{3}-\d{2}-\d{5})', html)
            biz_no_fmt = biz_match.group(1) if biz_match else f"{biz_no_10[:3]}-{biz_no_10[3:5]}-{biz_no_10[5:]}"
            
            # 사업자 현재 상태
            status_match = re.search(r'사업자 현재 상태[^\:]*:\s*([^\s<]+)', desc)
            status = status_match.group(1) if status_match else ""
            
            # 폐업일자 if any
            closed_date_match = re.search(r'폐업일자\s*:\s*(\d{4}-\d{2}-\d{2})', html) or re.search(r'폐업\s*일자\s*:\s*(\d{4}-\d{2}-\d{2})', desc)
            closed_date = closed_date_match.group(1) if closed_date_match else ""
            
            # 주소
            addr_match = re.search(r'소재지\s*</th>\s*<td[^>]*>(.*?)</td>', html) or re.search(r'주소\s*</th>\s*<td[^>]*>(.*?)</td>', html)
            addr = re.sub(r'<[^>]+>', ' ', addr_match.group(1)).strip() if addr_match else ""
            
            # 회사명
            title_match = re.search(r'<title>(.*?)</title>', html)
            title = title_match.group(1).replace("- 비즈노", "").strip() if title_match else ""
            
            return {
                "biz_no_10": biz_no_10,
                "biz_no": biz_no_fmt,
                "title": title,
                "ceo": ceo,
                "est_year": est_year,
                "est_month": est_month,
                "emp_cnt": emp_cnt,
                "status": status,
                "closed_date": closed_date,
                "addr": addr,
                "desc": desc
            }
    except Exception as e:
        return {"error": str(e)}

res = parse_bizno_article("3568700243")
print("모두싸인:", json.dumps(res, ensure_ascii=False, indent=2))

res2 = parse_bizno_article("2438601731")
print("아이티에프씨:", json.dumps(res2, ensure_ascii=False, indent=2))
