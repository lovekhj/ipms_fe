<!--
  파일 이름: ProjectList.vue
  설명: 프로젝트 리스트를 조회하고 보여주는 메인 화면입니다.
  역할:
    - API를 호출하여 데이터를 가져옵니다.
    - 가져온 데이터를 표(Table) 형태로 보여줍니다.
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPrjList } from '@/api/project';
import { getCommCdList } from '@/api/common';
import type { PrjDto, PrjReqDto } from '@/types/project';
import type { CommCdDto } from '@/types/common';

// 1. 화면에 보여줄 데이터 상태(State)를 만듭니다.
const projectList = ref<PrjDto[]>([]); // 프로젝트 목록 (처음엔 비어있음)
const isLoading = ref(false); // 로딩 중인지 여부
const errorMessage = ref(''); // 에러 메시지

// 공통 코드 상태
const prjGbnOptions = ref<CommCdDto[]>([]); // 프로젝트 구분 (PRJ_GBN)
const prjStsOptions = ref<CommCdDto[]>([]); // 진행 상태 (PRJ_STS_CD)
const officeLocOptions = ref<CommCdDto[]>([]); // 근무지 위치 (OFFICE_LOC)

// 검색 조건 상태
const searchParams = ref<PrjReqDto>({
  prjGbn: '',
  prjNm: '',
  prjStrDt: '',
  prjEndDt: '',
  prjStsCd: '',
  officeLoc: '',
  bizPrtnr: ''
});

// 화면이 열릴 때 실행되는 함수
onMounted(async () => {
  // 공통 코드 가져오기
  const result: any = await getCommCdList('PRJ_GBN,PRJ_STS_CD,OFFICE_LOC');
  console.log('화면 공통코드 수신:', result);

  // 혹시 데이터가 data 속성 안에 한번 더 감싸져 있다면 꺼내줍니다.
  const codes = result.data || result;

  if (codes['PRJ_GBN']) prjGbnOptions.value = codes['PRJ_GBN'];
  if (codes['PRJ_STS_CD']) prjStsOptions.value = codes['PRJ_STS_CD'];
  if (codes['OFFICE_LOC']) officeLocOptions.value = codes['OFFICE_LOC'];
});

// 2. 조회 버튼을 눌렀을 때 실행할 함수입니다.
const handleSearch = async () => {
  isLoading.value = true; // 로딩 시작
  errorMessage.value = ''; // 에러 메시지 초기화
  projectList.value = []; // 리스트 초기화

  try {
    // API 함수를 호출해서 데이터를 가져옵니다. searchParams.value를 넘겨줍니다.
    const data = await getPrjList(searchParams.value);
    projectList.value = data; // 가져온 데이터를 화면 변수에 넣어줍니다.
  } catch (error: any) {
    console.error('화면 에러:', error);
    errorMessage.value = `데이터 조회 실패: ${error.message || '알 수 없는 에러'}`;
  } finally {
    isLoading.value = false; // 로딩 끝
  }
};

// 초기화 버튼 함수
const handleReset = () => {
  searchParams.value = {
    prjGbn: '',
    prjNm: '',
    prjStrDt: '',
    prjEndDt: '',
    prjStsCd: '',
    officeLoc: '',
    bizPrtnr: ''
  };
};

// 3. 날짜 형식을 20240101 -> 2024-01-01 로 바꿔주는 함수입니다.
const formatDate = (date: string) => {
  if (!date || date.length !== 8) return date; // 데이터가 없거나 8자리가 아니면 그대로 보여줍니다.
  return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
};
</script>

<template>
  <div class="project-list-view">
    <h2>Project List</h2>
    
    <!-- 검색 조건 및 버튼 영역 -->
    <div class="search-area">
      <div class="search-rows">
        <!-- 첫 번째 줄: 구분, 프로젝트명 -->
        <div class="search-row">
          <div class="search-item">
            <label>구분</label>
            <select v-model="searchParams.prjGbn">
              <option value="">전체</option>
              <option v-for="opt in prjGbnOptions" :key="opt.cdVal" :value="opt.cdVal">
                {{ opt.cdValNm }}
              </option>
            </select>
          </div>
          <div class="search-item">
            <label>프로젝트명</label>
            <input type="text" v-model="searchParams.prjNm" placeholder="검색어 입력" />
          </div>
        </div>

        <!-- 두 번째 줄: 시작일, 종료일, 진행상태 -->
        <div class="search-row">
          <div class="search-item">
            <label>시작일</label>
            <!-- required 속성을 넣어줘야 :valid 선택자가 작동합니다 -->
            <input type="date" v-model="searchParams.prjStrDt" required />
          </div>
          <div class="search-item">
            <label>종료일</label>
            <input type="date" v-model="searchParams.prjEndDt" required />
          </div>
          <div class="search-item">
            <label>진행상태</label>
            <select v-model="searchParams.prjStsCd">
              <option value="">전체</option>
              <option v-for="opt in prjStsOptions" :key="opt.cdVal" :value="opt.cdVal">
                {{ opt.cdValNm }}
              </option>
            </select>
          </div>
        </div>

        <!-- 세 번째 줄: 위치, 발주처 -->
        <div class="search-row">
          <div class="search-item">
            <label>위치</label>
            <select v-model="searchParams.officeLoc">
              <option value="">전체</option>
              <option v-for="opt in officeLocOptions" :key="opt.cdVal" :value="opt.cdVal">
                {{ opt.cdValNm }}
              </option>
            </select>
          </div>
          <div class="search-item">
            <label>발주처</label>
            <select v-model="searchParams.bizPrtnr">
              <option value="">전체</option>
              <option value="skt">skt</option>
              <option value="하이닉스">하이닉스</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 버튼 그룹 -->
      <div class="btn-group">
        <button class="btn-reset" @click="handleReset" :disabled="isLoading">
          초기화
        </button>
        <button class="btn-search" @click="handleSearch" :disabled="isLoading">
          {{ isLoading ? '조회중...' : '조회' }}
        </button>
      </div>
    </div>
    
    <!-- 데이터 그리드(표) 영역 -->
    <div class="grid-area">
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
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
            <td>{{ prj.rowNum }}</td>
            <td>{{ prj.prjGbnNm }}</td>
            <td class="text-left">{{ prj.prjNm }}</td>
            <td>{{ prj.bizPrtnrNm }}</td>
            <td>{{ formatDate(prj.prjStrDt) }}</td>
            <td>{{ formatDate(prj.prjEndDt) }}</td>
            <td>{{ prj.prjStsNm }}</td>
            <td class="text-left">{{ prj.officeLocNm }}</td>
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
  align-items: flex-end; /* 버튼을 아래로 정렬 */
}

.search-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1; /* 남은 공간 차지 */
  margin-right: 20px;
}

.search-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-item label {
  font-weight: bold;
  font-size: 14px;
  color: #555;
  min-width: 60px; /* 라벨 너비 고정 */
}

/* 날짜 입력 스타일 수정 */
.search-item input[type="date"] {
  /* 값이 없을 때(invalid) 글자색을 투명하게 해서 연도.월.일 숨김 */
  color: transparent;
  width: 130px; /* 너비 조금 확보 */
}
/* 포커스 되거나 값이 있을 때(valid) 글자색 복구 */
.search-item input[type="date"]:focus,
.search-item input[type="date"]:valid {
  color: inherit;
}

.search-item input,
.search-item select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 32px;
}

/* 버튼 그룹 */
.btn-group {
  display: flex;
  gap: 8px;
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
  background-color: #0056b3;
}

.btn-search:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 초기화 버튼 스타일 */
.btn-reset {
  background-color: #6c757d; /* 회색 */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-reset:hover {
  background-color: #5a6268;
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
