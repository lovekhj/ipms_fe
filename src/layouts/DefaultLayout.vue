<!--
  파일 이름: DefaultLayout.vue
  설명: 화면의 전체적인 틀(레이아웃)을 잡는 파일입니다.
  역할:
    - 헤더, 메뉴, 푸터, 그리고 실제 내용(Main)을 어떻게 배치할지 정합니다.
    - 대부분의 페이지가 이 틀을 따릅니다.
-->
<script setup lang="ts">
// 우리가 미리 만들어둔 부품(컴포넌트)들을 가져옵니다.
import TheHeader from '@/components/common/TheHeader.vue';
import TheFooter from '@/components/common/TheFooter.vue';
import TheMenu from '@/components/common/TheMenu.vue';
</script>

<template>
  <div class="layout-container">
    <!-- 1. 가장 위에 헤더를 보여줍니다 -->
    <TheHeader />
    
    <div class="main-container">
      <!-- 2. 왼쪽에 메뉴를 보여줍니다 -->
      <TheMenu />
      
      <!-- 3. 나머지 공간에 실제 작업 화면을 보여줍니다 -->
      <main class="content-area">
        <!-- 
          RouterView는 아주 중요한 역할을 합니다.
          주소(URL)에 따라서 알맞은 화면으로 '갈아끼워주는' 액자 같은 존재입니다.
          예: '/project/list' 주소로 가면, 이 자리에 'ProjectList.vue'가 나타납니다.
        -->
        <RouterView />
      </main>
    </div>
    
    <!-- 4. 가장 아래에 푸터를 보여줍니다 -->
    <TheFooter />
  </div>
</template>

<style scoped>
/* 화면 전체 레이아웃 스타일 */
.layout-container {
  display: flex;
  flex-direction: column; /* 위에서 아래로 쌓이게(헤더 -> 메인 -> 푸터) */
  height: 100vh; /* 화면 전체 높이를 다 씁니다 (Viewport Height) */
  min-width: 1200px; /* 화면이 너무 작아지면 깨지지 않게 최소 너비를 잡습니다 */
}

/* 중간 영역 (메뉴 + 본문) 스타일 */
.main-container {
  display: flex; /* 메뉴와 본문을 '옆으로' 나란히 두기 위해 사용 */
  flex: 1; /* 남은 공간을 모두 차지합니다 */
  overflow: hidden; /* 내용이 넘쳐도 전체 화면 스크롤이 생기지 않게 막습니다 */
}

/* 실제 본문 영역 스타일 */
.content-area {
  flex: 1; /* 메뉴를 제외한 나머지 공간을 모두 씁니다 */
  padding: 20px; /* 창틀과 내용 사이의 여백 */
  background-color: #ffffff;
  overflow-y: auto; /* 내용이 많으면 본문 영역 안에서만 스크롤이 생깁니다 */
}
</style>
