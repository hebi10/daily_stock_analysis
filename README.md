# 일일 주식 분석 AI

AI 모델을 이용해 관심 종목을 분석하고, Web UI와 알림 채널로 결과를 확인하는 주식 분석 프로젝트입니다.

## 주요 기능

- 관심 종목 자동 분석
- Web UI에서 분석 실행, 기록 조회, 설정 관리
- OpenAI 호환 모델 연결
- Discord, Slack, Telegram 등 알림 전송
- 포트폴리오, 백테스트, AI 신호 화면 제공
- Docker와 GitHub Actions 실행 지원

## 빠른 시작

```powershell
git clone https://github.com/hebi10/daily_stock_analysis.git
cd daily_stock_analysis
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

`.env` 파일을 열어 필요한 값을 입력합니다.

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5.5

DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
STOCK_LIST=AAPL,MSFT,NVDA
```

## 실행

일회성 분석:

```powershell
python main.py
```

특정 종목 분석:

```powershell
python main.py --stocks AAPL,MSFT,NVDA
```

Web UI 실행:

```powershell
python main.py --webui
```

브라우저에서 `http://127.0.0.1:8000`으로 접속합니다.

## OpenAI 설정

기본 OpenAI API를 쓸 때는 `.env`에 아래 값만 넣으면 됩니다.

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5.5
```

다른 OpenAI 호환 API를 쓰는 경우 `OPENAI_BASE_URL`과 `OPENAI_MODEL`만 해당 서비스 값으로 바꾸면 됩니다.

## Discord 알림 설정

Discord 서버에서 채널 설정을 열고 Webhook을 만든 뒤 URL을 `.env`에 넣습니다.

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

알림이 가지 않으면 먼저 Webhook URL이 맞는지, 봇이 해당 채널에 메시지를 보낼 수 있는지 확인하세요.

## 자주 쓰는 명령

```powershell
python main.py --debug
python main.py --dry-run
python main.py --market-review
python main.py --schedule
python main.py --serve-only
```

## 설정 파일

- `.env`: 실제 실행 설정. API Key 같은 비밀값은 여기에만 둡니다.
- `.env.example`: 설정 예시.
- `apps/dsa-web`: Web UI 코드.
- `docs`: 상세 문서.

## 주의

이 프로젝트의 분석 결과는 투자 참고용입니다. 매수, 매도, 보유 판단과 손익 책임은 사용자에게 있습니다.
