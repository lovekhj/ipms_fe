# IPMS 프론트엔드 개발 일지 (1단계: 기본 환경 구성)

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
  }
})
```

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

```html
<template>
  <div class="layout-container">
    <!-- 1. 헤더를 맨 위에 둡니다 -->
    <TheHeader />
    
    <div class="main-container">
      <!-- 2. 왼쪽에 메뉴를 둡니다 -->
      <TheMenu />
      
      <!-- 3. 나머지 공간에 실제 작업 화면(Page)이 들어갑니다 -->
      <main class="content-area">
        <!-- RouterView는 현재 주소에 맞는 화면을 갈아끼워주는 액자입니다 -->
        <RouterView />
      </main>
    </div>
    
    <!-- 4. 맨 아래에 푸터를 둡니다 -->
    <TheFooter />
  </div>
</template>
```

## 5. 길 안내 설정하기 (Router)
`src/router/index.ts` 파일에서 "어떤 주소로 들어오면 어떤 화면을 보여줄지" 정했습니다.

```typescript
const router = createRouter({
  // ... 설정 생략 ...
  routes: [
    {
      path: '/', // 홈페이지(루트)로 들어오면
      component: DefaultLayout, // 전체 틀(레이아웃)을 먼저 보여주고
      children: [
        {
          path: 'project/list', // '/project/list' 주소라면
          name: 'ProjectList',  
          component: ProjectList, // 프로젝트 리스트 화면을 그 틀 안에 넣어줍니다.
        }
      ]
    }
  ]
});
```

---

여기까지가 프로젝트를 시작하기 위한 **기초 공사** 단계였습니다.
이제 이 튼튼한 기반 위에서 본격적으로 "프로젝트 리스트" 기능을 만들 것입니다.
