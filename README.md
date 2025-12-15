# Sensor-Udon Frontend 🚚

![React](https://img.shields.io/badge/React-18.2-blue) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000) ![Status](https://img.shields.io/badge/Status-Capstone_Project-success)

**IoT 기반 스마트 배달 박스(Safe Food) 프로젝트의 프론트엔드 대시보드**입니다.
백엔드 파이프라인을 통해 정제된 센서 데이터(온도, 습도, 기울기)를 실시간으로 수신하여, **최종 사용자(User)에게 시각화된 모니터링 환경을 제공하는 End-to-End 파이프라인의 마지막 단계**입니다.

## 📋 프로젝트 개요
이 프로젝트는 배달원이 배달통을 기울이거나 온도가 부적절할 때 발생하는 데이터를 감지하여 시각적으로 경고를 표시합니다.
사용자는 이 대시보드를 통해 배달 과정의 데이터 흐름을 직관적으로 파악할 수 있습니다.

* **Backend Repository:** [SensorUdon-backend](https://github.com/dlcodudco/SensorUDon-backend)

## ✨ Key Features (Visualization)
* **Real-time Dashboard:** REST API를 통해 백엔드에서 정제된 최신 센서 값을 실시간 렌더링
* **Safety Monitoring:** 기울기(Tilt) 및 온습도 임계값 초과 시 즉각적인 UI 경고 표시 (Rule-based Mapping)
* **Data Lineage View:** 하드웨어 센서에서 시작된 데이터가 최종적으로 어떻게 표현되는지 보여주는 시각화 인터페이스

## 🛠️ Tech Stack
* **Framework:** React
* **Deployment:** Vercel (CI/CD 자동화 구축)

---
## 🚀목차
- [진행 현황](#-진행-현황-progress)
- [개발 사이클](#-개발-사이클-development-workflow)
- [Git 커밋 메시지 컨벤션](#-git-커밋-메시지-컨벤션)
---

## 📆진행 현황 (Progress)
| 기능 | 상태 | 설명 |
|---|---|---|
| **프로젝트 세팅** | ✅ 완료 | React 환경 설정 |
| **Vercel 자동 배포** | ✅ 완료 | GitHub Actions + Vercel 환경 |
| **폴더 구조 세팅** | ✅ 완료 | 컴포넌트 구조화 |
| **기능 구현** | ✅ 완료 | 대시보드 및 알림 UI |

> 🟡 : 개발 중 / ⏳ : 예정 / ✅ : 완료
---

## 🔄 개발 사이클 (Development Workflow)

이 프로젝트는 **GitHub Flow**를 기반으로 하며, 다음과 같은 절차로 개발을 진행합니다

### 📌 브랜치 전략

| 브랜치명 | 용도 |
|---|---|
| `main` | 운영 배포용 (배포되는 안정 버전) |
| `dev` | 개발용 통합 브랜치 |
| `feat/(기능명)` | 기능 개발 브랜치 (`feat/login` 등) |


---

### 👨‍💻 기능 개발 절차

```bash
# 1. dev에서 기능 브랜치 생성
git switch dev
git pull origin dev
git switch -c feat/login  # 기능명 기준

# 2. 코드 작성 & 커밋
git add .
git commit -m "feat: 로그인 컴포넌트 구현" # 기능명 기준

# 3. 원격 브랜치 푸시
git push origin feat/login

# 4. GitHub에서 PR 생성 → 대상 브랜치: dev
