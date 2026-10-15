import urllib.request
import urllib.parse
import re

for q in ["킴엔존슨", "킴앤존슨"]:
    url = "https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            if "검색된 데이터가 없습니다" in html:
                print(f"MCST {q}: 0 results")
            else:
                matches = re.findall(r'<a[^>]+href="searchView.php\?([^"]+)"[^>]*>(.*?)</a>', html)
                print(f"MCST {q} matches:", matches)
    except Exception as e:
        print(e)
