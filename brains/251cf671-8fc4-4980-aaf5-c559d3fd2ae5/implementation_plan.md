# 기업 상세 정보 확장(전화번호, 이메일, 홈페이지, 매출, 인원) 구현 계획서

현재 프로젝트에서 사용 중인 사업자 상태조회(국세청) 및 기업명 조회(비즈노) API에 더해, 요청하신 **5가지 추가 정보(전화번호, 메일 주소, 최신년도 IFRS 연결 매출, 최신년도 인원, 유효한 홈페이지 주소)**를 가져와 화면에 보여주기 위한 아키텍처 및 구현 계획입니다.

---

## 1. 데이터 소스(API) 분석 및 확보 방안

### ① 연락처 정보 (전화번호, 메일 주소, 홈페이지)
* **출처:** **Bizno API (현재 연동 완료된 상태)**
* **구현 방안:** 
  - 기존에 `CompanyController`에서 상호명(`company`)을 가져오던 로직을 확장하여, 응답 JSON 내에 포함된 `tel`(전화번호), `email`(메일 주소), `homepage`(홈페이지 주소) 필드를 추가로 파싱(추출)합니다.

### ② 유효성 검증된 홈페이지 주소 (중요)
* **요구사항:** "현재 인터넷에 살아있고, 실제로 접속 가능한 링크만"
* **구현 방안:**
  - Bizno API 등에서 추출한 `homepage` URL 문자열을 대상으로 **웹 크롤러/HTTP 통신 로직(Java `HttpURLConnection`)**을 백엔드에서 수행합니다.
  - 해당 URL로 `GET` 또는 `HEAD` 요청을 보내어 응답 코드(HTTP Status)가 `200 OK` 혹은 정상 접속 범위(2xx~3xx)인 경우에만 프론트엔드로 전달합니다. 접속이 불가능하거나(404, 500), 타임아웃이 발생하면 `null` 처리합니다.

### ③ 재무 및 인원 정보 (매출-최신 IFRS 연결 / 인원)
* **출처:** **DART(금융감독원 전자공시시스템) Open API** 또는 **국민연금 가입 사업장 내역 API (공공데이터포털)** / **비즈노 상세 API**
* **특이사항:** 재무(연결 매출) 및 인원은 Bizno 무료 API에서 상세히 제공하지 않을 수 있으므로, 기업의 공식 공시 데이터를 제공하는 API가 필요합니다.
* **구현 방안:**
  1. **매출 (IFRS 연결):** DART API의 `단일회사 주요계정 API (/api/fnlttSinglAcnt.json)`를 호출하여 **최신 사업연도**의 **연결재무제표(CFS)** 기준 **'매출액'** 값을 추출합니다.
  2. **인원 수:** 공공데이터포털의 '국민연금 가입 사업장 내역' API (사업자번호 기반)를 통해 현 가입자 수(인원)를 추출하거나, DART API의 `직원현황 API`를 호출하여 최신 총 인원수를 계산합니다.

---

## 2. 백엔드 (Spring Boot) 구현 단계

### Step 2.1: 데이터베이스(MongoDB) 모델 확장
기존 `SearchHistory.java` (DB 저장 양식) 파일에 새로운 필드들을 추가합니다.
```java
// 기존 필드
private String bizNumber;
private String status;
private String companyName;

// 신규 추가 필드
private String phone;
private String email;
private String homepage;
private Long revenue; // 매출액 (단위: 원)
private Integer employeeCount; // 인원 수 (명)
```

### Step 2.2: Bizno API 응답 로직 수정
`CompanyController` 내부 파싱 로직을 업데이트합니다.
```java
// 예시 코드 
String phone = firstItem.hasNonNull("tel") ? firstItem.get("tel").asText() : "";
String email = firstItem.hasNonNull("email") ? firstItem.get("email").asText() : "";
String rawHomepage = firstItem.hasNonNull("homepage") ? firstItem.get("homepage").asText() : "";

// 홈페이지 접속 유효성 검사 실행
String validHomepage = validateUrlExistance(rawHomepage);
```

### Step 2.3: 홈페이지 접속 유효성 검사기(Validator) 생성
서버에서 홈페이지를 핑(Ping) 해보고 살아있는지 체크하는 함수를 추가합니다. (접속 지연을 막기 위해 3초 타임아웃 설정)
```java
private String validateUrlExistance(String urlStr) {
    if(urlStr == null || urlStr.isEmpty()) return null;
    try {
        if(!urlStr.startsWith("http")) urlStr = "http://" + urlStr;
        HttpURLConnection connection = (HttpURLConnection) new URL(urlStr).openConnection();
        connection.setRequestMethod("HEAD"); // 내용 대신 헤더만 빠르게 가져와서 생존 확인
        connection.setConnectTimeout(3000); // 3초 제한
        
        int responseCode = connection.getResponseCode();
        if (responseCode >= 200 && responseCode <= 399) {
            return urlStr; // 활성화된 URL!
        }
    } catch (Exception e) {
        return null; // 접속 실패 (죽은 링크)
    }
    return null;
}
```

### Step 2.4: DART Open API / 공공데이터 API 연동 로직 추가
사업자번호를 키(Key)로 삼아 3번째 외부 API(DART / 국민연금 API)와 비동기로 통신하는 로직을 붙이고, 결과를 추출한 뒤 기존 결과값(`dataNode`)에 `put("revenue", 매출액)` 형태로 끼워 넣습니다.

---

## 3. 프론트엔드 (Next.js) 구현 단계

### Step 3.1: UI 컴포넌트 확장
프론트엔드에서는 추가된 JSON 응답값을 받아 화면 리스트 뷰 혹은 상세 카드 뷰에 출력해 줍니다.
* **매출액 표시:** `Intl.NumberFormat`을 사용해 `1,000,000,000 원` 처럼 읽기 좋게 컴마를 찍어줍니다.
* **홈페이지 주소:** 활성화된 주소가 올 경우에만 `<a>` 태그로 클릭 가능한 외부 링크(`target="_blank"`) 버튼을 만들어줍니다. (예: "🌐 공식 홈페이지 바로가기")
* **로딩 처리:** URL 유효성 검증과 2~3개의 복합 API를 다녀오기 때문에 백엔드 로딩 시간이 약간 증가할 수 있으므로 로딩 스피너 등의 UX 처리가 권장됩니다.
