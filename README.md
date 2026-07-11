# spincell-error-test

500 에러 30종을 의도적으로 발생시키는 NestJS + MongoDB(Mongoose) 테스트 서버.
CloudWatch → Lambda → Claude AI 에러 분석 파이프라인 검증용.

## 실행 방법 (EC2)

```bash
git clone https://github.com/choigeon0501/test.git && cd test
npm install
cp .env.example .env   # MONGO_URI를 실제 값으로 수정 (DB명: spincell-test)
npm run build
npm run start:prod     # 또는 pm2 start dist/main.js --name spincell-error-test
```

정상 확인: `GET /api/health` → 200

> DB 시드 데이터(users/products/orders)는 이미 spincell-test DB에 들어있음.

## 에러 API 30종

| # | Method | Path | Body/Query | 에러 유형 |
|---|--------|------|-----------|----------|
| 1 | POST | `/api/orders/64f000000000000000000000/pay` | `{"amount":1000}` | null 구조분해 (주문 없음) |
| 2 | GET | `/api/users/profile` | (기본 noprofile 유저) | undefined.avatar 접근 |
| 3 | POST | `/api/orders/bulk` | `{"orders":[{"userEmail":"a@b.c","amount":100}]}` | undefined.map |
| 4 | GET | `/api/products/price` | (기본 NO-PRICE-001) | undefined.toFixed |
| 5 | POST | `/api/auth/login` | `{"method":"kakao"}` | is not a function |
| 6 | GET | `/api/users/search-deep` | | 깊은 undefined 접근 |
| 7 | GET | `/api/orders/report/aggregate` | | MongoServerError ($strLenBytes 타입) |
| 8 | GET | `/api/products/legacy-filter` | | MongoServerError (unknown operator) |
| 9 | GET | `/api/database/legacy-replica` | | ECONNREFUSED (커넥션 거부) |
| 10 | GET | `/api/orders/report/slow` | | 쿼리 타임아웃 (maxTimeMS) |
| 11 | POST | `/api/users/duplicate` | `{}` (2회째부터) | E11000 duplicate key |
| 12 | POST | `/api/payments` | `{}` | Mongoose ValidationError |
| 13 | GET | `/api/external/inventory-sync` | | 외부 API 타임아웃 |
| 14 | POST | `/api/external/charge` | `{"amount":5000}` | ENOTFOUND (DNS 실패) |
| 15 | GET | `/api/external/exchange-rate` | | 업스트림 500 전파 |
| 16 | GET | `/api/external/partner-catalog` | | 응답 구조 불일치 → .map crash |
| 17 | GET | `/api/reports/monthly` | | JSON.parse SyntaxError |
| 18 | GET | `/api/reports/date-range` | (from 없이) | Invalid Date → RangeError |
| 19 | GET | `/api/reports/grand-total` | | BigInt+number TypeError |
| 20 | GET | `/api/reports/export` | | 순환 참조 stringify |
| 21 | GET | `/api/search/legacy` | | Promise reject 미처리 |
| 22 | GET | `/api/search/all-shards` | | Promise.all 부분 실패 |
| 23 | GET | `/api/search/category-tree` | | 재귀 스택 오버플로우 |
| 24 | GET | `/api/search/page` | (기본 page=99) | 배열 인덱스 초과 |
| 25 | GET | `/api/config/gateway-key` | | env 누락 → undefined.trim |
| 26 | GET | `/api/config/cache-buckets` | | NaN 배열 길이 RangeError |
| 27 | GET | `/api/config/apm` | | Cannot find module |
| 28 | GET | `/api/files/service-account` | | ENOENT (파일 없음) |
| 29 | POST | `/api/files/upload-meta` | `{"fileName":"a.png"}` | EISDIR (디렉토리에 write) |
| 30 | GET | `/api/files/download-buffer` | | 버퍼 할당 초과 RangeError |

## 에러 로그 포맷

HttpExceptionFilter가 운영 서버와 동일한 단일 라인 포맷으로 출력:

```
POST /api/auth/login → 500 | {} | body={"method":"kakao"}
TypeError: validator is not a function
    at AuthService.login (/.../dist/auth/auth.service.js:21:23)
    ...
```

CloudWatch Agent로 stdout(또는 로그파일)을 `/spincell/prd/app` 로그 그룹의
`app-err-*` 스트림으로 보내면 기존 Lambda 파이프라인이 그대로 동작.

## 참고

- 5xx만 스택 포함 ERROR, 4xx는 WARN 한 줄
- DB 미연결 시에도 부팅됨(lazyConnection). DB 엔드포인트는 buffering timeout으로 500
- #1: 유효한 형식이지만 존재하지 않는 ObjectId 사용 (잘못된 형식이면 CastError로 다른 에러)
- #11: unique 인덱스는 서버 첫 기동 시 Mongoose autoIndex가 생성
