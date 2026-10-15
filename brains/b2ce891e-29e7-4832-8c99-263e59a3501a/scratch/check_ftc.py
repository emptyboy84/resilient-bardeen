import urllib.request
import urllib.parse
import json
import re

def search_ftc(biz_no):
    # FTC bizCommList POST / GET
    url = "https://www.ftc.go.kr/www/bizCommList.do?key=232"
    # let's see FTC parameters
    print("Checking FTC...")

if __name__ == "__main__":
    search_ftc("3098601593")
