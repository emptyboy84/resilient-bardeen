import json
from test_detail_parser import parse_bizno_detail

# Let's inspect 6042312006, 6179038101
for b in ["6042312006", "6179038101"]:
    res = parse_bizno_detail(b)
    print(b, res.get("title"), res.get("ceo"), res.get("addr"), res.get("tel"))
