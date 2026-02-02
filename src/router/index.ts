/*
  파일 이름: router/index.ts
  설명: 웹사이트의 '네비게이션'을 담당하는 파일입니다.
  역할:
    - 특정 주소(URL)로 들어왔을 때, 어떤 화면(Component)을 보여줄지 정합니다.
    - 예: 사용자가 '/project/list'를 입력하면 -> ProjectList.vue 화면을 보여줘!
*/

import { createRouter, createWebHistory } from 'vue-router'; // 뷰 라우터라는 도구를 가져옵니다.
import DefaultLayout from '@/layouts/DefaultLayout.vue'; // 기본 레이아웃 틀을 가져옵니다.
import ProjectList from '@/views/project/ProjectList.vue'; // 프로젝트 리스트 화면을 가져옵니다.

// 라우터(길 안내 도우미)를 만듭니다.
const router = createRouter({
  // 히스토리 모드: 웹 브라우저의 '뒤로 가기' 버튼이 잘 작동하도록 해줍니다.
  history: createWebHistory(import.meta.env.BASE_URL),

  // 길 안내 규칙들 (Routes)
  routes: [
    {
      path: '/', // 사용자가 홈페이지 루트(맨 처음 화면)로 들어오면
      component: DefaultLayout, // 일단 전체 레이아웃(틀)을 보여줍니다.
      redirect: '/project/list', // 그리고 바로 '/project/list'로 이동시킵니다. (첫 화면 설정)

      // 레이아웃 안에 들어갈 자식 화면들입니다.
      children: [
        {
          path: 'project/list', // 주소가 '/project/list' 라면
          name: 'ProjectList',  // 이 길의 이름은 'ProjectList' 입니다.
          component: ProjectList, // ProjectList.vue 화면을 틀 안에 끼워 보여줍니다.
        },
        // 나중에 다른 화면(멤버 관리, 공통 코드 등)도 여기에 추가하면 됩니다.

        // 사용자가 이상한 주소로 들어왔을 때 처리 (가장 마지막에 둡니다)
        {
          path: ':pathMatch(.*)*', // 위에 정의되지 않은 모든 주소는
          redirect: '/project/list' // 프로젝트 리스트로 보내버립니다.
        }
      ]
    }
  ]
});

// 만든 라우터를 밖으로 내보냅니다. (main.ts에서 쓰기 위해)
export default router;
