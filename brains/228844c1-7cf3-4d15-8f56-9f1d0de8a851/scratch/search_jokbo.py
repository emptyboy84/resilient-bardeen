import urllib.request
import urllib.parse
import re

# 1. MCST search
url_mcst = "https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=" + urllib.parse.quote("족보관")
req = urllib.request.Request(url_mcst, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("MCST 족보관 search:")
        if "검색된 데이터가 없습니다" in html:
            print("  MCST: No results")
        else:
            matches = re.findall(r'<a[^>]+href="searchView.php\?([^"]+)"[^>]*>(.*?)</a>', html)
            for link, title in matches:
                print("  MCST Match:", title, link)
except Exception as e:
    print("MCST Error:", e)

# 2. Bizno search
url_bizno = "https://bizno.net/?area=%EB%B6%80%EC%82%B0&query=" + urllib.parse.quote("족보관")
req = urllib.request.Request(url_bizno, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("Bizno 족보관 search:")
        if "0개의 결과를 찾았습니다" in html:
            print("  Bizno: 0 results")
        else:
            matches = re.findall(r'<a[^>]+href="(/article/(\d+))"[^>]*>(.*?)</a>', html)
            for link, bno, title in matches:
                if "족보" in title:
                    print("  Bizno Match:", bno, title)
except Exception as e:
    print("Bizno Error:", e)
