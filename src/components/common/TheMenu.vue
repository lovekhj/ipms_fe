<!--
  파일 이름: TheMenu.vue
  설명: 화면 왼쪽에 위치하는 메뉴 바입니다.
  역할:
    - 사용자가 이동할 수 있는 메뉴 목록을 보여줍니다.
    - 메뉴를 클릭하면 해당 페이지로 이동시킵니다.
    - 그룹(프로젝트, 멤버 등)으로 메뉴를 묶어서 보여줍니다.
-->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 페이지 이동을 돕는 도구(router)를 가져옵니다.
const router = useRouter();

// 메뉴 데이터를 정의합니다.
// ref()는 데이터가 바뀌면 화면도 자동으로 바뀌게 해주는 Vue의 마법 상자입니다.
// 여기서는 메뉴 목록이 고정되어 있지만, 나중에 서버에서 받아올 수도 있어서 ref를 썼습니다.
const menus = ref([
  {
    title: '프로젝트', // 그룹 제목
    items: [
      { name: '프로젝트리스트', path: '/project/list' }, // 메뉴 이름과 이동할 주소
      { name: '프로젝트관리', path: '/project/manage' },
    ]
  },
  {
    title: '멤버',
    items: [
      { name: '멤버리스트', path: '/member/list' },
      { name: '멤버관리', path: '/member/manage' },
    ]
  },
  {
    title: '공통',
    items: [
      { name: '공통코드', path: '/common/code' },
      { name: '제휴사리스트', path: '/partner/list' },
      { name: '제휴사관리', path: '/partner/manage' },
    ]
  }
]);

/**
 * 함수 이름: goTo
 * 설명: 메뉴를 클릭했을 때 실행되는 함수입니다.
 * 역할: 인자로 받은 경로(path)로 화면을 이동시킵니다.
 * 
 * @param path 이동할 페이지의 주소 (예: '/project/list')
 */
const goTo = (path: string) => {
  router.push(path); // router에게 "이 주소로 가줘!"라고 명령합니다.
};
</script>

<template>
  <aside class="menu">
    <div class="menu-title">MENU</div>
    
    <!-- 메뉴 목록 영역 -->
    <ul class="menu-list">
      <!-- v-for: 메뉴 그룹(프로젝트, 멤버 등) 개수만큼 반복해서 그립니다 -->
      <!-- :key: 반복할 때 각각을 구분하는 이름표입니다 -->
      <li v-for="(group, index) in menus" :key="index" class="menu-group">
        
        <!-- 그룹 제목 (예: 프로젝트) -->
        <div class="group-title">{{ group.title }}</div>
        
        <!-- 하위 메뉴 목록 (예: 프로젝트리스트, 프로젝트관리) -->
        <ul class="sub-menu">
          <!-- 또 다시 v-for로 하위 메뉴들을 반복해서 그립니다 -->
          <li 
            v-for="(item, subIndex) in group.items" 
            :key="subIndex" 
            class="menu-item"
            @click="goTo(item.path)" 
          >
            <!-- @click: 클릭하면 goTo 함수를 실행합니다 -->
            {{ item.name }}
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* 전체 메뉴 바 스타일 */
.menu {
  width: 250px; /* 너비 고정 */
  background-color: #f4f5f7; /* 배경색 */
  border-right: 1px solid #e0e0e0; /* 오른쪽에 경계선 */
  height: 100%; /* 부모 높이를 꽉 채움 */
  display: flex;
  flex-direction: column; /* 내용물을 위에서 아래로 쌓음 */
}

/* "MENU" 라고 써있는 제목 부분 */
.menu-title {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}

/* 메뉴 리스트 (스크롤 가능하게) */
.menu-list {
  padding: 0;
  margin: 0;
  list-style: none; /* 점(bullet) 제거 */
  overflow-y: auto; /* 내용이 넘치면 스크롤바 생김 */
}

.menu-group {
  border-bottom: 1px solid #eee; /* 그룹마다 구분선 */
}

.group-title {
  padding: 15px 20px;
  font-weight: 600; /* 약간 굵게 */
  color: #333;
  font-size: 14px;
}

.sub-menu {
  padding: 0;
  list-style: none;
}

.menu-item {
  padding: 10px 20px 10px 30px; /* 들여쓰기 효과를 위해 왼쪽 패딩을 더 줌 */
  font-size: 13px;
  color: #555;
  cursor: pointer; /* 마우스 올리면 손가락 모양 */
  transition: background-color 0.2s, color 0.2s; /* 색이 바뀔 때 부드럽게 */
}

/* 마우스를 메뉴 위에 올렸을 때 (:hover) */
.menu-item:hover {
  background-color: #e3e8ef; /* 배경색 변경 */
  color: #2c3e50; /* 글자색 변경 */
}
</style>
