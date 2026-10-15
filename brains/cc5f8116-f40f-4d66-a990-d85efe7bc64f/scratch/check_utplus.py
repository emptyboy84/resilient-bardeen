from master_search_pipeline import get_bizno_detail
import json

res = get_bizno_detail("2148795150")
print(json.dumps(res, ensure_ascii=False, indent=2))
