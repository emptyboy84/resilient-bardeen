import sys
import re
import urllib.request
import urllib.parse
import json
import socket
import openpyxl
from openpyxl.styles import PatternFill

sys.stdout.reconfigure(encoding='utf-8')

f1 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720.xlsx'
f2 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
out_path = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_검증완료.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid") # 신규 입력 (노란색)
orange_fill = PatternFill(start_color="FFA500", end_color="FFA500", fill_type="solid") # 수정/삭제 (주황색)

def is_valid_url(url):
    if not url or url.strip() in ['-', '']:
        return False
    url = url.strip()
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'http://' + url
        
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                return True
    except Exception:
        pass
    return False

def is_valid_email(email):
    if not email or email.strip() in ['-', '']:
        return False
    email = email.strip()
    # 기본 이메일 정규식
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False
    # 도메인 추출 및 MX/IP 체크
    domain = email.split('@')[-1]
    try:
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False

print("검증 및 보완 로직 준비 완료.")
