<!--
  파일 이름: TheHeader.vue
  설명: 화면의 가장 위쪽(헤더)을 담당하는 파일입니다.
  역할:
    - 로고(IPMS)를 보여줍니다.
    - 로그인한 사용자 정보(현재는 'Admin User')를 보여줍니다.
    - 모든 페이지에서 공통으로 보입니다.
-->
<script setup lang="ts">
// 지금은 특별한 기능(함수)이 없어서 비어있습니다.
// 나중에 로그인 정보를 가져오는 기능이 여기에 추가될 수 있습니다.
</script>

<template>
  <!-- 헤더 전체를 감싸는 상자입니다 -->
  <header class="header">
    <!-- 왼쪽: 로고 영역 -->
    <div class="logo">
      <h1>IPMS</h1>
    </div>
    
    <!-- 오른쪽: 사용자 정보 영역 -->
    <div class="user-info">
      <span>Admin User</span>
    </div>
  </header>
</template>

<style scoped>
/*
  scoped: 이 스타일은 오직 이 파일(TheHeader.vue)에만 적용된다는 뜻입니다.
  다른 파일에 같은 이름의 클래스가 있어도 영향을 주지 않습니다.
*/

.header {
  display: flex; /* 가로로 배치하기 위해 사용합니다 */
  justify-content: space-between; /* 양 끝으로 벌어지게 배치합니다 (왼쪽 로고 <-> 오른쪽 사용자) */
  align-items: center; /* 세로 기준 가운데 정렬합니다 */
  height: 60px; /* 높이는 60픽셀입니다 */
  padding: 0 20px; /* 안쪽 여백: 위아래 0, 좌우 20픽셀 */
  background-color: #ffffff; /* 배경색은 흰색입니다 */
  border-bottom: 1px solid #e0e0e0; /* 아래쪽에 얇은 회색 줄을 긋습니다 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* 살짝 그림자를 줘서 입체감을 줍니다 */
}

.logo h1 {
  font-size: 24px; /* 글자 크기 */
  font-weight: 700; /* 글자 굵기 (두껍게) */
  color: #333; /* 글자 색상 (진한 회색) */
  margin: 0; /* 바깥 여백 제거 */
}

.user-info {
  font-size: 14px; /* 글자 크기 */
  color: #666; /* 글자 색상 (중간 회색) */
}
</style>
