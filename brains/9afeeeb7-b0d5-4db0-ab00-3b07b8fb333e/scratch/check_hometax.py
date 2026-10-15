import urllib.request
import json
import xml.etree.ElementTree as ET

bno = "8990100125"

url = "https://www.hometax.go.kr/wqAction.do?actionId=ATTFZZ3008M01&screenId=UTEABAAA13&popupYn=false&realScreenId="
xml_data = f'<map id="ATTFZZ3008M01"><txprDscmNo>{bno}</txprDscmNo></map>'

req = urllib.request.Request(
    url,
    data=xml_data.encode("utf-8"),
    headers={
        "Content-Type": "application/xml; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
)

try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        content = resp.read().decode("utf-8")
        print("Response:")
        print(content)
except Exception as e:
    print(f"Error: {e}")
