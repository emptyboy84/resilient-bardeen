# 💬 대화 기록 (Chat History)

> **대화 세션 ID**: `ec8edc40-9142-4d57-894a-fb743fcfdbd7`  
> **생성 일시**: `2026-10-13T00:54:28Z`  
> **총 사용자 요청 수**: 1건  
> **총 어시스턴트 응답/작업 수**: 1건  

---

### 👤 USER (질문/요청 #1)

> ⏰ 일시: `2026-10-13T00:54:28Z`

<USER_REQUEST>
This is a side question from the user. You MUST answer directly in a single response. Your tools are disabled. You cannot read files, write files, run commands, search, or take any actions. You must complete your response in a single turn with no follow-up turns. Only use information already in the conversation context or your own knowledge. Never promise to take action or say "let me check...". Here is the question: 꼭 법인번호랑 맞아떨어져야하나
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-13T09:54:28+09:00.
</ADDITIONAL_METADATA>

---

### 🤖 ANTIGRAVITY (응답/실행 내용 #1)

> ⏰ 일시: `2026-10-13T00:54:29Z`

결론부터 말씀드리면, **실무 목적에 따라 유연하게 판단하실 수 있지만 주의가 필요**합니다.

---

### 1. 원칙: 법인번호가 일치해야 100% 동일 법인입니다
* **상호 중복 문제:** `더플로우`, `와컴퍼니`, `그레이트` 같은 일반 명칭은 전국에 개인사업자 및 법인을 통틀어 수십~수백 개가 존재합니다.
* **유일한 고유 식별자:** 법인의 법적 실체를 특정하는 유일한 번호는 **법인등록번호(13자리)**이므로, 법인번호가 일치해야 엉뚱한 타사(동명 개인사업자나 서울/경기 소재 타 법인) 번호가 들어가는 오입력을 완벽히 방지할 수 있습니다.
* 배현명 님께서 찾으신 **`(주)더플로우 (899-37-01327)`**의 경우, 법인번호 `180111-0168647`과 대표자 `김선민`, 주소가 정확히 일치하는 완벽한 정답 사례입니다.

---

### 2. 예외 및 실무 기준: 꼭 법인번호가 안 보여도 괜찮은 경우
머니핀, 잡코리아, 포털 등 일부 조회 서비스에서는 개인정보 보호 및 DB 특성상 **법인등록번호가 표기되지 않거나 마스킹(`180111-*******`)**되어 있는 경우가 많습니다.

이 경우 아래 **3가지 조건이 일치하면 법인번호가 직접 확인되지 않아도 동일 기업으로 보고 입력하셔도 됩니다.**

1. **상호명 일치** (법인 격인 `(주)` 포함 여부 확인)
2. **대표자명 일치** (동명이인 여부 확인)
3. **사업장 주소 일치** (부산 관내 동일 구·동 또는 도로명 주소)

---

### 💡 실무 가이드 요약
* **[상호명 + 대표자명 + 주소] 3박자가 맞다면**: 법인번호가 화면에 직접 안 떠도 해당 기업의 사업자등록번호가 맞으므로 **기입하셔도 무방**합니다.
* **단, 상호명만 같고 대표자나 주소가 완전히 다른 경우**(예: 서울 소재, 대표자 불일치)는 동명이사(타사)이므로 입력하시면 안 됩니다.

---