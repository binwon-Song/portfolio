# 1. Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY ./package.json ./
COPY ./.env.production ./.env.production
# CI는 clean install로, lock 파일 기반의 정확한 설치를 보장합니다.
RUN npm i
RUN npm i rollup

# 소스 코드 복사
COPY ./src ./src
COPY ./ ./

RUN npm run build


# 2. Runner Stage
FROM node:20-alpine

WORKDIR /app

# 빌드 단계에서 생성된 결과물과 필요한 의존성만 복사
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .

# 컨테이너 외부에서 접속 가능하도록 Host 설정 (중요)
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD [ "node", "build" ]