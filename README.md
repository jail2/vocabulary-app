# 영단어 암기 앱

과학적 암기 원리(스페이싱 반복, 능동적 회상)를 적용한 영단어 학습 앱입니다.

## 설치 방법

### PowerShell 실행 정책 문제 해결

PowerShell에서 npm 명령어가 실행되지 않는 경우, 다음 방법 중 하나를 사용하세요:

#### 방법 1: PowerShell 실행 정책 변경 (권장)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 방법 2: 명령 프롬프트(CMD) 사용
PowerShell 대신 명령 프롬프트를 열어서 실행하세요:
```cmd
cd c:\Users\user\Desktop\영단어암기
npm install
npm run dev
```

#### 방법 3: PowerShell에서 bypass 옵션 사용
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

## 일반 설치 및 실행

```bash
cd c:\Users\user\Desktop\영단어암기
npm install
npm run dev
```

## 기능

### 🎯 핵심 기능
- **스페이싱 반복 (Leitner System)**: 5단계 박스 시스템으로 최적의 복습 주기 제공
- **능동적 회상**: 뜻을 보고 단어를 입력하는 플래시카드 모드
- **퀴즈 모드**: 객관식 문제로 실력 테스트
- **진행률 추적**: 정답률, 완료 단어 수 등 통계 제공
- **단어장**: 강/연습문제별 필터링 기능

### 📚 포함된 단어
- 1강: Exercise 2, Exercise 5 (19개 단어)
- 5강: Exercise 2, Exercise 3, Exercise 5, Exercise 6 (48개 단어)
- 9강: Exercise 1, Exercise 2, Exercise 3, Exercise 5~6 (37개 단어)
- 총 104개 단어

### 🎮 사용법
1. **홈**: 오늘의 학습 현황 확인
2. **학습**: 플래시카드로 복습 필요한 단어 학습
3. **퀴즈**: 랜덤 10개 문제 풀기
4. **단어장**: 모든 단어 검색 및 필터링
5. **통계**: 학습 통계 및 진행률 초기화

## 학습 원리

### 스페이싱 반복 (Spaced Repetition)
- 단어를 한 번에 여러 번 반복하는 것보다 시간 간격을 두고 반복하는 것이 장기 기억에 더 효과적
- Leitner System: 5단계 박스로 단어의 숙련도에 따라 다른 복습 주기 적용

### 능동적 회상 (Active Recall)
- 단순히 단어를 다시 보는 것보다 뜻을 보고 단어를 떠올리는 것이 기억력 향상에 효과적
- 테스트 효과: 테스트를 받는 것이 단순 복습보다 학습 효과가 큼

## 기술 스택
- React 18
- Vite
- TailwindCSS
- Lucide Icons
