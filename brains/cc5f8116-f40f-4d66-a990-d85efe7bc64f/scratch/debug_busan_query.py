from turbo_bizno_matcher import parse_search_page

res = parse_search_page("모두싸인 부산")
print("모두싸인 부산:", len(res))
for r in res:
    print("  ->", r)

res2 = parse_search_page("인우랩 부산")
print("인우랩 부산:", len(res2))
for r in res2:
    print("  ->", r)
