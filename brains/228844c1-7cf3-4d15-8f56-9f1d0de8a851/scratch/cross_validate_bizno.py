import json
import re

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_verified.json', encoding='utf-8') as f:
    matches = json.load(f)

def clean(s):
    return re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', str(s)).lower()

high_confidence = []
low_confidence = []

for m in matches:
    t = m['target']
    t_name = clean(t['name'])
    m_name = clean(m['title'])
    t_addr = clean(t['addr'])
    m_addr = clean(m['bizno_addr'])
    t_rep = clean(t['rep'])
    m_rep = clean(m['rep'])
    t_phone = re.sub(r'[^0-9]', '', t['phone'])
    
    score = 0
    reasons = []
    
    # Check Busan location
    is_busan = '부산' in m_addr or '부산' in t_addr or t['sigungu'] in m_addr
    
    # Exact name match
    if t_name == m_name:
        score += 3
        reasons.append("exact_name")
    elif t_name in m_name or m_name in t_name:
        # Check if too short/generic (e.g. 2 chars)
        if len(t_name) >= 3 or len(m_name) >= 3:
            score += 2
            reasons.append("sub_name")
        else:
            score += 1
            reasons.append("short_sub_name")
            
    # Rep match
    if t_rep and m_rep and (t_rep == m_rep or t_rep in m_rep):
        score += 3
        reasons.append("rep_match")
        
    # Addr match
    if t_addr and m_addr:
        # Check common words in addr
        common_words = [w for w in re.split(r'[\s,]+', t['addr']) if len(w) >= 2 and w in m['bizno_addr']]
        if len(common_words) >= 2:
            score += 3
            reasons.append(f"addr_match({','.join(common_words)})")
            
    if is_busan:
        score += 1
        reasons.append("is_busan")
    else:
        # Not Busan - penalty unless exact rep or exact long name
        score -= 2
        reasons.append("not_busan")
        
    m['confidence_score'] = score
    m['reasons'] = reasons
    
    if score >= 3:
        high_confidence.append(m)
    else:
        low_confidence.append(m)

print(f"High confidence matches: {len(high_confidence)}")
print(f"Low confidence (need check): {len(low_confidence)}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_high_confidence.json', 'w', encoding='utf-8') as f:
    json.dump(high_confidence, f, ensure_ascii=False, indent=2)

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_low_confidence.json', 'w', encoding='utf-8') as f:
    json.dump(low_confidence, f, ensure_ascii=False, indent=2)
