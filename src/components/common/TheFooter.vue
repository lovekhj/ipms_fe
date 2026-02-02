<!--
  파일 이름: TheFooter.vue
  설명: 화면의 가장 아래쪽(푸터)을 담당하는 파일입니다.
  역할:
    - 저작권 정보(Copyright)를 표시합니다.
    - 모든 페이지에서 공통으로 보입니다.
-->
<script setup lang="ts">
// 푸터는 보여주기만 하면 되므로, 특별한 기능(스크립트)이 없습니다.
</script>

<template>
  <!-- 푸터 전체를 감싸는 상자입니다 -->
  <footer class="footer">
    <p>&copy; 2026 IPMS System. All rights reserved.</p>
  </footer>
</template>

<style scoped>
/* 푸터 꾸미기 */
.footer {
  height: 40px; /* 높이는 40픽셀로 얇게 잡습니다 */
  display: flex; /* 내부 내용물을 정렬하기 위해 사용 */
  justify-content: center; /* 가로 기준 가운데 정렬 */
  align-items: center; /* 세로 기준 가운데 정렬 */
  background-color: #f8f9fa; /* 배경은 아주 연한 회색 */
  border-top: 1px solid #e0e0e0; /* 위쪽에 얇은 선을 긋습니다 */
  color: #888; /* 글자 색은 연한 회색 */
  font-size: 12px; /* 글씨는 작게 */
}
</style>
