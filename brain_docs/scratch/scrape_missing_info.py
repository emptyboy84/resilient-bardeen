import sys
import re
import urllib.request
import urllib.parse
import json
import socket
import concurrent.futures
import openpyxl
from openpyxl.styles import PatternFill

sys.stdout.reconfigure(encoding='utf-8')

f_out = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_검증완료.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

def get_biz_info(biz_no, company_name):
    clean_biz = re.sub(r'[^0-9]', '', str(biz_no)) if biz_no else ''
    info = {'대표자': None, '전화번호': None, '팩스번호': None, '홈페이지': None, '이메일': None}
    
    if not clean_biz:
        return info
        
    url = f"https://bizno.net/article/{clean_biz}"
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        with urllib.request.urlopen(req, timeout=4) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            rep_m = re.search(r'대표자[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
            if rep_m: info['대표자'] = rep_m.group(1).strip()
            
            phone_m = re.search(r'전화번호[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
            if phone_m: info['전화번호'] = phone_m.group(1).strip()
            
            fax_m = re.search(r'팩스번호[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
            if fax_m: info['팩스번호'] = fax_m.group(1).strip()
            
            hp_m = re.search(r'홈페이지[^\w\n]*</th>[^\w\n]*<td><a[^>]*href=["\']([^"\']+)["\']', html)
            if hp_m: info['홈페이지'] = hp_m.group(1).strip()
            
            email_m = re.search(r'이메일[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
            if email_m: info['이메일'] = email_m.group(1).strip()
    except Exception:
        pass
        
    return info

print("스크립트 준비 완료.")
