<!--
  파일 이름: ProjectList.vue
  설명: 프로젝트 리스트를 조회하고 보여주는 메인 화면입니다.
  역할:
    - API를 호출하여 데이터를 가져옵니다.
    - 가져온 데이터를 표(Table) 형태로 보여줍니다.
-->
<script setup lang="ts">
import { ref } from 'vue';
import { getPrjList } from '@/api/project';
import type { PrjDto } from '@/types/project';

// 1. 화면에 보여줄 데이터 상태(State)를 만듭니다.
const projectList = ref<PrjDto[]>([]); // 프로젝트 목록 (처음엔 비어있음)
const isLoading = ref(false); // 로딩 중인지 여부
const errorMessage = ref(''); // 에러 메시지

// 2. 조회 버튼을 눌렀을 때 실행할 함수입니다.
const handleSearch = async () => {
  isLoading.value = true; // 로딩 시작
  errorMessage.value = ''; // 에러 메시지 초기화
  projectList.value = []; // 리스트 초기화

  try {
    // API 함수를 호출해서 데이터를 가져옵니다.
    const data = await getPrjList();
    projectList.value = data; // 가져온 데이터를 화면 변수에 넣어줍니다.
  } catch (error: any) {
    console.error('화면 에러:', error);
    errorMessage.value = `데이터 조회 실패: ${error.message || '알 수 없는 에러'}`;
  } finally {
    isLoading.value = false; // 로딩 끝
  }
};
</script>

<template>
  <div class="project-list-view">
    <h2>Project List</h2>
    
    <!-- 검색 조건 및 버튼 영역 -->
    <div class="search-area">
      <div class="search-form">
        <label>프로젝트명</label>
        <input type="text" placeholder="검색어 입력" />
        
        <label>구분</label>
        <select>
          <option value="">전체</option>
          <option value="운영">운영</option>
          <option value="개발">개발</option>
        </select>
      </div>
      
      <!-- 조회 버튼: 클릭하면 handleSearch 함수가 실행됩니다 -->
      <button class="btn-search" @click="handleSearch" :disabled="isLoading">
        {{ isLoading ? '조회중...' : '조회' }}
      </button>
    </div>
    
    <!-- 데이터 그리드(표) 영역 -->
    <div class="grid-area">
      <table class="data-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>프로젝트명</th>
            <th>주관사</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>상태</th>
            <th>위치</th>
          </tr>
        </thead>
        <tbody>
          <!-- 에러가 있을 때 -->
          <tr v-if="errorMessage">
            <td colspan="7" class="no-data error-text">
              {{ errorMessage }}
            </td>
          </tr>
          <!-- 데이터가 없을 때 -->
          <tr v-else-if="projectList.length === 0">
            <td colspan="7" class="no-data">
              {{ isLoading ? '데이터를 불러오는 중입니다...' : '조회된 데이터가 없습니다.' }}
            </td>
          </tr>
          
          <!-- 데이터가 있을 때 반복해서 그립니다 (v-for) -->
          <tr v-else v-for="prj in projectList" :key="prj.prjId">
            <td>{{ prj.prjGbn }}</td>
            <td class="text-left">{{ prj.prjNm }}</td>
            <td>{{ prj.bizPrtnr }}</td>
            <td>{{ prj.prjStrDt }}</td>
            <td>{{ prj.prjEndDt }}</td>
            <td>{{ prj.prjStsCd }}</td>
            <td>{{ prj.officeLoc }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.project-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 검색 영역 스타일 */
.search-area {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-form input,
.search-form select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 버튼 스타일 */
.btn-search {
  background-color: #007bff; /* 파란색 */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-search:hover {
  background-color: #0056b3; /* 마우스 올리면 좀 더 진하게 */
}

.btn-search:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 테이블 스타일 */
.grid-area {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse; /* 테두리 겹침 방지 */
}

.data-table th,
.data-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 14px;
}

.data-table th {
  background-color: #f1f3f5;
  font-weight: bold;
  color: #333;
}

.data-table tr:hover {
  background-color: #f8f9fa; /* 마우스 올렸을 때 줄 강조 */
}

.text-left {
  text-align: left !important;
}

.no-data {
  padding: 40px;
  color: #999;
}

.error-text {
  color: #d32f2f;
  font-weight: bold;
}
</style>
