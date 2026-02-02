/*
  파일 이름: main.ts
  설명: Vue 애플리케이션의 '현관문' 같은 파일입니다.
  역할:
    - 앱을 실행할 때 가장 먼저 실행됩니다.
    - Vue 앱을 생성하고, 우리가 만든 라우터(router)나 스타일(css)을 연결합니다.
    - 최종적으로 index.html에 있는 #app 태그에 화면을 그려줍니다.
*/

import { createApp } from 'vue' // Vue를 만드는 공장(createApp)을 가져옵니다.
import App from './App.vue' // 가장 최상위 껍데기 화면(App.vue)을 가져옵니다.
import router from './router' // 우리가 설정한 길 안내 도우미(router)를 가져옵니다.

import './assets/main.css' // 전역 스타일(모든 곳에 적용되는 디자인)을 가져옵니다.

// 1. Vue 앱(인스턴스)을 생성합니다.
const app = createApp(App)

// 2. 앱에 라우터(길 안내 도우미)를 장착합니다.
app.use(router)

// 3. 이제 준비된 앱을 화면의 #app 이라는 곳에 실제로 그립니다(Mount).
app.mount('#app')
