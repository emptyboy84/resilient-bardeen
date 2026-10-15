from turbo_bizno_matcher import parse_search_page, clean_company_name

res = parse_search_page("모두싸인")
print("parse_search_page('모두싸인'):", len(res))
for r in res:
    print("  ->", r)

res2 = parse_search_page("인우랩")
print("parse_search_page('인우랩'):", len(res2))
for r in res2:
    print("  ->", r)
