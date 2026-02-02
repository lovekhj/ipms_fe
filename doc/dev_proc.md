# IPMS 프론트엔드 개발 일지 (3단계: API 주소 변경)

이 문서는 IPMS 프로젝트의 프론트엔드(화면)를 만드는 과정을 초보자도 이해할 수 있도록 기록한 개발 일지입니다.

---

## 1. 프로젝트 만들기 (Project Creation)
가장 먼저, Vue.js라는 도구를 사용해서 빈 프로젝트를 만들었습니다.
마치 그림을 그리기 위해 도화지와 물감을 준비하는 과정과 같습니다.

**사용된 명령어:**
```bash
# npm(자바스크립트 앱 스토어)을 이용해 vite(빠른 개발 도구)로 vue 프로젝트 생성
npm create vite@latest ipms-fe -- --template vue-ts
```

- **Vue-ts**: Vue.js를 쓰면서 TypeScript(엄격한 문법 검사기)도 같이 쓰겠다는 뜻입니다.

## 2. 필요한 도구 설치하기 (Libraries)
집을 지을 때 망치와 톱이 필요하듯, 개발에도 편라한 도구들이 필요합니다.

```bash
npm install axios vue-router
```

- **axios (액시오스)**: 서버에서 데이터를 가져오거나 보낼 때 사용하는 '배달부'입니다.
- **vue-router (뷰 라우터)**: 페이지를 이동시켜주는 '네비게이션'입니다. (예: 메뉴 클릭 시 해당 화면으로 이동)

## 3. 편리한 설정 추가하기 (Configuration)
코드를 짤 때 파일을 찾기 쉽게 만드는 설정을 했습니다.
`../../components/Header.vue` 처럼 복잡한 주소 대신 `@/components/Header.vue` 처럼 간단하게 쓰기 위함입니다.

### 3.1 `vite.config.ts` 수정
```typescript
// 파일의 경로를 다루기 위해 필요한 도구들을 가져옵니다.
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // '@' 라는 기호를 쓰면 무조건 'src' 폴더를 가리키도록 약속합니다.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
  server: {
    // 6. 서버 연결을 위한 대리자(Proxy) 설정
    proxy: {
      '/api': { // '/api'로 시작하는 요청은
        target: 'http://localhost:8080', // 무조건 이 주소(백엔드 서버)로 보냅니다.
        changeOrigin: true, // 도메인이 달라도 요청을 허용하게 속여줍니다.
        // rewrite: (path) => path.replace(/^\/api/, '') // (제거) 이제 /api를 지우지 않고 그대로 보냅니다.
      }
    }
  }
})
```
> [!NOTE]
> 서버 주소가 `localhost:8080/api/prj/list`와 같이 변경되었으므로, 프론트엔드에서도 `/api`를 잘라내지 않고 그대로 보내도록 프록시 설정을 변경할 수 있습니다. (현재는 코드만 변경함)


### 3.2 `tsconfig.app.json` 수정
TypeScript에게도 `@`가 `src` 폴더라는 것을 알려줘야 오류가 나지 않습니다.
```json
{
  "compilerOptions": {
    // ... 다른 설정들 ...
    
    // 기본 경로를 현재 위치('.')로 잡습니다.
    "baseUrl": ".",
    // '@'로 시작하는 모든(*) 경로는 'src' 폴더 밑에서 찾으라고 알려줍니다.
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 4. 화면의 기본 틀 만들기 (Layout)
모든 페이지에 공통으로 들어가는 머리말(Header), 꼬리말(Footer), 메뉴(Menu)를 만들었습니다.

### 4.1 부품 만들기 (Components)
레고 블록처럼 각각의 역할을 하는 파일들을 `src/components/common` 폴더에 만들었습니다.
- **TheHeader.vue**: 로고와 사용자 정보가 표시되는 상단 바
- **TheFooter.vue**: 저작권 정보가 표시되는 하단 바
- **TheMenu.vue**: 왼쪽에서 페이지 이동을 도와주는 메뉴 바

### 4.2 전체 틀 조립하기 (DefaultLayout.vue)
위에서 만든 부품들을 모아서 하나의 화면 틀을 `src/layouts/DefaultLayout.vue`에 만들었습니다.

## 5. 데이터 준비하기 (Data & API)

### 5.1 데이터 모양 정의하기 (Types)
서버에서 어떤 모양의 데이터를 줄지 미리 약속하는 문서를 만들었습니다.
`src/types/project.d.ts` 파일에 `PrjDto`라는 이름으로 정의했습니다.
(최신 업데이트: 코드(`Cd`) 외에도 화면 표시를 위한 이름(`Nm`) 필드들이 추가되었습니다.)

```typescript
export interface PrjDto {
  rowNum: string;      // 순번
  // ... 기존 필드 ...
  prjGbnNm: string;    // 프로젝트 구분명
  prjStsNm: string;    // 상태명
  officeLocNm: string; // 근무지 위치명
  bizPrtnrNm: string;  // 주관사명
}
```

### 5.2 서버와 통신하기 (API)
`src/api/project.ts` 파일을 만들어서, 실제 서버에 데이터를 요청하는 기능을 넣었습니다.
`getPrjList` 함수를 호출하면, 진짜 서버(`localhost:8080/api/prj/list`)에 가서 데이터를 받아옵니다.

## 6. 프로젝트 리스트 화면 만들기 (View)
`src/views/project/ProjectList.vue` 파일에 실제 화면을 구현했습니다.
- 검색 버튼을 누르면 `getPrjList` 함수를 실행합니다.
- 받아온 데이터를 `<table>` 태그를 이용해 표로 보여줍니다.
- 데이터가 없을 때는 "조회된 데이터가 없습니다"라고 친절하게 알려줍니다.

---

이제 사용자가 조회 버튼을 누르면 -> 프론트엔드가 백엔드 서버에 요청하고 -> 받아온 데이터를 화면에 표로 그려줍니다.
이것으로 기본적인 **프로젝트 리스트 조회** 기능이 완성되었습니다!
