# 정보융합학부 챗봇 프로젝트

## 📌 프로젝트 개요

안녕하세요. 저희는 **광운대학교 정보융합학부** 학생들을 위한 챗봇 서비스를 개발한 KW-VIP-LLM 팀입니다.

본 프로젝트는 **정보융합학부에 대한 정보를 쉽고 직관적으로 접할 수 있도록** 돕는 것을 목표로 하며,  
단순한 정보 전달을 넘어 **진로 탐색과 학과 선택에 실질적인 도움을 주는 지능형 서비스** 구현을 지향합니다.

> **주요 기술 스택**: Gemini API, Faiss, Python, 웹 프론트엔드

---

## 🔍 프로젝트 배경

정보융합학부에 관심은 있지만, 구체적인 내용을 접하기 어려워하는 자율전공 학생들이 많습니다.  
이를 해결하기 위해 챗봇을 도입하고, 기존의 키워드 중심 정보 제공 방식을 넘어  
**LLM 기반의 자연어 응답과 벡터 검색 기반의 정확한 질의응답 서비스**를 제공하고자 했습니다.

---

## 🏗️ 시스템 구조

본 시스템은 총 3가지 주요 구성 요소로 이루어져 있습니다.

1. **접속 경로**

   - QR 코드 또는 웹사이트를 통해 챗봇 인터페이스에 접근 가능

2. **질문 처리**

   - 사용자의 질문은 **Gemini API**를 통해 자연어 처리
   - 답변 생성 시 문맥을 이해하여 더 자연스럽고 풍부한 정보 제공

3. **문서 기반 응답 최적화**
   - **Faiss** 기반 벡터 검색을 활용하여 관련 정보 문서에서 유사도 기반 답변 추출
   - 기존의 단순 키워드 검색보다 더 정밀한 결과 제공

---

## ⚙️ 주요 기능

- **시나리오 기반 버튼 UI**
  - 초심자도 쉽게 사용할 수 있도록 버튼 선택형 시나리오 설계
- **질문 유형별 응답 구성**
  - 예: “어떤 수업을 듣게 되나요?” → 과목 리스트 + 상세 설명 제공
- **접근성 강화**
  - QR 코드 기반 모바일 접근 가능 (※ 현재는 서버 미연결 상태)

---

## 📸 실행 화면

- 버튼 클릭에 따라 질문 시나리오가 전개되며, 상황에 따라 버튼 항목이 동적으로 바뀝니다.
- 복잡한 정보를 직관적으로 제공할 수 있도록 구성하였습니다.
- 과목 소개, 활동 정보, 진로 방향 등에 대한 콘텐츠를 직접 확인할 수 있습니다.

---

## 👥 팀 정보

- 광운대학교 정보융합학부 챗봇 개발팀 (KW-VIP-LLM) IDEA LAB

---

## 실행 방법

### 직접 실행

1. docker-compose.yml에서 포트 수정

   ```docker-compose.yml
   version: "3.8"

   services:
     frontend:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "{원하는포트}:80"
       volumes:
         - ./nginx.conf:/etc/nginx/conf.d/default.conf
       restart: unless-stopped
   ```

1. `docker compose up -d` 입력

### jenkins

배포 포트 변경 어려움.

예시 pipeline

    ```JenkinsPipeline
    pipeline {
        agent any


        stages {
            stage('Checkout') {
                steps {
                    git branch: "main",
                    url: "https://github.com/KW-IC-CHATBOT/KW-IC-LLM-FE.git"
                }
            }


            stage('Build and Deploy') {
                steps {
                    script {
                        sh '''
                            docker compose down --remove-orphans

                            docker compose build
                            docker compose up -d
                        '''
                    }
                }
            }
        }

        post {
            failure {
                sh 'docker compose down'
            }
        }
    }
    ```
