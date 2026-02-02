<!--
  파일 이름: App.vue
  설명: 우리 웹사이트의 가장 바깥쪽 껍데기 파일입니다.
  역할:
    - 웹사이트 어느 페이지를 가더라도 이 App.vue 안에 들어있게 됩니다.
    - 지금은 단순히 <RouterView />만 가지고 있지만, 
      나중에 앱 전체에 영향을 주는 기능이 필요하면 여기에 넣습니다.
-->
<script setup lang="ts">
import { RouterView } from 'vue-router'
// RouterView: 주소에 맞는 화면을 보여주는 '마법 액자' 컴포넌트입니다.
</script>

<template>
  <!-- 
    여기서는 아무런 꾸밈 없이 RouterView 하나만 딱 놓습니다.
    (실제 레이아웃은 Layouts/DefaultLayout.vue 에서 잡고 있습니다)
  -->
  <RouterView />
</template>

<style>
/* 
  여기에 스타일을 작성하면 전역으로 적용될 수 있지만,
  보통은 assets/main.css 파일에 따로 모아서 관리하는 것이 좋습니다.
*/
</style>
