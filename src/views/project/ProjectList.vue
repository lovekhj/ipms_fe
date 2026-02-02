<!--
  파일 이름: ProjectList.vue
  설명: 프로젝트 리스트를 조회하고 보여주는 메인 화면입니다.
  역할:
    - [나중에 구현] 검색 조건(프로젝트명, 상태 등)을 입력받습니다.
    - [나중에 구현] 조회 버튼을 누르면 서버에서 데이터를 가져옵니다.
    - [나중에 구현] 가져온 데이터를 표(Grid) 형식으로 보여줍니다.
-->
<script setup lang="ts">
// 아직은 기능이 없어서 비어있습니다.
// 다음 단계에서 데이터를 가져오는 코드(API 호출)가 이곳에 들어갈 예정입니다.
</script>

<template>
  <div class="project-list-view">
    <!-- 화면 제목 -->
    <h2>Project List Search</h2>
    
    <!-- 검색 조건 영역 (Search Area) -->
    <div class="search-area">
      <!-- 나중에 검색 입력창과 버튼들이 여기에 들어옵니다 -->
      <p>Search Area Placeholder (검색 영역이 들어갈 자리입니다)</p>
    </div>
    
    <!-- 데이터 그리드 영역 (Grid Area) -->
    <div class="grid-area">
      <!-- 나중에 데이터 목록 표가 여기에 들어옵니다 -->
      <p>Grid Area Placeholder (데이터 표가 들어갈 자리입니다)</p>
    </div>
  </div>
</template>

<style scoped>
/* 프로젝트 리스트 화면 스타일 */
.project-list-view {
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  gap: 20px; /* 각 상자(제목, 검색, 그리드) 사이에 20px 간격을 줍니다 */
}

/* 검색 영역 스타일 */
.search-area {
  padding: 20px;
  background-color: #f8f9fa; /* 연한 회색 배경 */
  border: 1px solid #eee;
  border-radius: 4px; /* 모서리를 둥글게 */
}

/* 그리드 영역 스타일 */
.grid-area {
  border: 1px solid #eee;
  min-height: 400px; /* 데이터가 없어도 최소 이만큼 높이는 확보합니다 */
  padding: 20px;
}
</style>
