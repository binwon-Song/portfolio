# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
 
## 로컬에서 로그인(인증) 테스트하기

아래 절차는 이 레포지토리의 Firebase Auth 기반 로그인 흐름을 확인하는 방법입니다.

1) 환경변수 확인

프로젝트 루트에 `.env` 파일에 Firebase 구성 값들이 있어야 합니다. 예:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

2) 개발 서버 실행

호스트에서 개발 서버를 바로 실행하려면:

```bash
npm install
npm run dev
```

혹은 도커 바인드 마운트를 사용한다면:

```bash
docker compose up
```

3) Firebase 콘솔에서 테스트 사용자 추가

Firebase Console -> Authentication -> Users -> "Add user" 로 이메일/비밀번호 사용자 추가하세요. (테스트 전용 계정)

4) 로그인 테스트

- 브라우저에서 `http://localhost:5173/login` 열고 추가한 이메일/비밀번호로 로그인하세요.
- 로그인 성공 시 코드상 `goto('/admin')`로 이동합니다.
- 실패 시 페이지의 에러 메시지와 브라우저 개발자도구(Console, Network)를 확인하세요.

5) 에뮬레이터 사용(선택)

로컬에서 Firebase Emulator를 사용하면 실제 프로젝트 데이터를 건드리지 않고 테스트할 수 있습니다.

- `firebase-tools` 설치:

```bash
npm install -g firebase-tools
```

- 프로젝트에 에뮬레이터 설정 후:

```bash
# 에뮬레이터 시작 (Auth, Firestore 등 필요한 서비스만 선택)
firebase emulators:start --only auth,firestore
```

참고: 앱 코드에서 에뮬레이터에 연결하려면 `connectAuthEmulator` / `connectFirestoreEmulator`를 호출해야 합니다. 자세한 방법은 Firebase 문서를 참고하세요.

6) 디버깅 팁

- `src/lib/firebase.ts`에서 `getAuthClient()`를 통해 클라이언트에서만 Auth를 초기화하도록 구현되어 있습니다. 로그인 관련 호출은 브라우저(예: `onMount`, 이벤트 핸들러)에서 발생해야 합니다.
- 브라우저 콘솔에서 나오는 에러 메시지(특히 CORS, 네트워크, 권한 관련)를 확인하세요.
- Firestore/Authentication 보안 규칙이 클라이언트의 읽기/쓰기를 허용하는지 확인하세요.
- 데이터가 보이지 않거나 401/403 에러가 나오면 Firebase 콘솔에서 인증/규칙과 사용 중인 프로젝트 ID가 `.env`의 `VITE_FIREBASE_PROJECT_ID`와 일치하는지 확인하세요.

문제가 지속되면 여기서 나온 콘솔 에러 스택을 붙여 보내주시면 원인 분석을 도와드리겠습니다.
