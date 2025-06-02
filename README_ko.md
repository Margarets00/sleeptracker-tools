# SleepTracker Tools

SleepTracker 침대 정보를 가져오는 도구입니다.

[English Documentation](README.md)

## NPX 사용

```bash
npx sleeptracker-tools
```

## 쉘 스크립트 사용

```bash
# 실행 권한 부여
chmod +x sleeptracker-get-deviceId.sh

# 실행
./sleeptracker-get-deviceId.sh
```

## Docker 사용

```bash
# Docker 스크립트 실행 권한 부여
chmod +x run-docker.sh

# 빌드 및 실행
./run-docker.sh
```

또는 Docker 명령어를 직접 실행:

```bash
# 이미지 빌드
docker build -t sleeptracker-tools .

# 실행
docker run -it --rm sleeptracker-tools
```

## 기능

- SleepTracker 계정으로 로그인
- 연결된 침대 목록 표시
- 각 침대의 상세 정보 표시:
  - 침대 ID
  - 이름
  - 모델
  - 펌웨어 버전
  - 상태 (활성/비활성)
  - WiFi 신호 강도
  - 파워베이스 정보 (있는 경우) 