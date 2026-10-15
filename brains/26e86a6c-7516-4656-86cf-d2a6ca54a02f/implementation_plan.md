# SSD 용량 추가 최대 확보 계획서 (배현명 주인님 전용)

배현명 주인님, C 드라이브 SSD 용량을 **추가로 더 확보**하기 위해 고효율 시스템 최적화 옵션을 조사 중입니다.

> [!IMPORTANT]
> **원칙 준수 사항**: 엑셀 관련 프로그램 및 주인님의 모든 문서/작업 파일은 100% 안전하게 보호하며, 오직 시스템 부피 축소 및 불필요한 OS 레벨 파일만 정리합니다.

---

## 1. 추가 용량 확보 후보 항목 및 예상 절감량

| 구분 | 정리/최적화 항목 | 예상 추가 확보 용량 | 설명 및 안전성 |
| :--- | :--- | :--- | :--- |
| **1. DISM ResetBase** | `DISM /StartComponentCleanup /ResetBase` | **약 2.0 ~ 4.0 GB** | 이전 버전 OS 업데이트 백업을 완전 제거하여 WinSxS 폴더 축소 |
| **2. Compact OS 적용** | `compact.exe /CompactOS:always` | **약 2.5 ~ 4.5 GB** | Windows OS 핵심 파일 압축 (성능 영향 없음, 즉시 취소 가능) |
| **3. 최대절전모드 파일 축소/비활성화** | `powercfg /h off` (또는 reduced) | **약 3.0 ~ 7.0 GB** | PC 최대절전모드용 메모리 덤프 파일(`hiberfil.sys`) 제거/축소 |
| **4. Windows 섀도 복사본 정리** | `vssadmin delete shadows` / Restore Point 정리 | **약 1.0 ~ 3.0 GB** | 이전 시스템 복원 지점 파일 정리 |
| **5. 브라우저 캐시 및 브라우저 임시 파일** | Chrome/Edge Cache 전체 비우기 | **약 0.5 ~ 1.5 GB** | 웹 브라우저 오프라인 미디어/이미지 캐시 삭제 |

---

## 2. 세부 스캔 및 실행 절차

1. 현재 `hiberfil.sys`, `pagefile.sys`, WinSxS 크기 및 C: 드라이브 폴더별 사용량 정밀 측정
2. 안전한 시스템 최적화(DISM ResetBase, CompactOS, 최대절전모드 정리 등) 순차 적용
3. 최적화 완료 후 확보된 최종 용량 보고
