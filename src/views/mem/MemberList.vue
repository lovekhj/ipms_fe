<!--
  파일 이름: MemberList.vue
  설명: 멤버 목록을 조회하고 보여주는 화면입니다.
  역할:
    - 검색 조건(이름/구분)을 입력받아 서버에 조회 요청을 보냅니다.
    - 서버에서 받은 멤버 데이터를 표 형태로 화면에 출력합니다.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCommCdList } from '@/api/common';
import { getMemList } from '@/api/member';
import type { CommCdDto } from '@/types/common';
import type { MemDto, MemReqDto } from '@/types/member';

// 페이지 이동(router)을 사용하기 위한 객체입니다.
const router = useRouter();

// 1) 표에 출력할 실제 멤버 목록 데이터입니다. (처음에는 빈 배열)
const memberList = ref<MemDto[]>([]);

// 2) 버튼 비활성화/로딩 문구 제어용 상태입니다.
const isLoading = ref(false);

// 3) 조회 중 에러가 나면 사용자에게 보여줄 메시지입니다.
const errorMessage = ref('');

// 4) 검색 조건 상태입니다. v-model로 입력창/콤보박스와 연결됩니다.
const searchParams = ref<MemReqDto>({
  memNm: '',
  mbrType: '',
  cellPhoneNum: ''
});

// 5) 공통 코드 MBR_TYPE 목록(구분 콤보박스 옵션)입니다.
const memberTypeOptions = ref<CommCdDto[]>([]);

// 6) 수정 버튼에서 사용할 "선택된 멤버" 상태입니다.
const selectedMember = ref<MemDto | null>(null);

// 화면이 열릴 때 한번 실행됩니다.
onMounted(async () => {
  // 구분 콤보박스에 사용할 공통 코드(MBR_TYPE)를 먼저 불러옵니다.
  const result: any = await getCommCdList('MBR_TYPE');
  const codes = result.data || result;

  if (codes['MBR_TYPE']) {
    memberTypeOptions.value = codes['MBR_TYPE'];
  }
});

/**
 * 함수 이름: handleSearch
 * 설명: 조회 버튼 클릭 시 실행됩니다.
 * 역할:
 *   - 검색 조건으로 /api/mem/list 호출
 *   - 성공 시 memberList에 결과 채우기
 *   - 실패 시 에러 문구 표시
 */
const handleSearch = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  memberList.value = [];

  try {
    const data = await getMemList(searchParams.value);
    memberList.value = data;
    selectedMember.value = null; // 새 조회를 하면 이전 선택값은 지웁니다.
  } catch (error: any) {
    console.error('멤버 화면 조회 에러:', error);
    errorMessage.value = `데이터 조회 실패: ${error?.message || '알 수 없는 에러'}`;
  } finally {
    isLoading.value = false;
  }
};

/**
 * 함수 이름: handleReset
 * 설명: 초기화 버튼 클릭 시 실행됩니다.
 * 역할:
 *   - 검색 조건을 기본값으로 되돌립니다.
 *   - 표 데이터/에러 문구도 함께 초기화합니다.
 */
const handleReset = () => {
  searchParams.value = {
    memNm: '',
    mbrType: '',
    cellPhoneNum: ''
  };
  memberList.value = [];
  errorMessage.value = '';
  selectedMember.value = null;
};

/**
 * 함수 이름: formatDate
 * 설명: 8자리 날짜 문자열(YYYYMMDD)을 YYYY-MM-DD로 바꿔줍니다.
 */
const formatDate = (date?: string) => {
  if (!date || date.length !== 8) return date || '';
  return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
};

/**
 * 함수 이름: formatPhone
 * 설명: 휴대폰 번호를 보기 쉬운 형태(000-0000-0000)로 바꿔줍니다.
 * 동작 방식:
 *   1) 숫자만 남기고 모두 제거합니다. (하이픈, 공백 등 제거)
 *   2) 11자리면 3-4-4 형식으로 변환합니다.
 *   3) 10자리면 3-3-4 형식으로 변환합니다. (예: 010-123-4567)
 *   4) 그 외 길이는 원본 값을 그대로 보여줍니다.
 */
const formatPhone = (phone?: string) => {
  if (!phone) return '';

  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 11) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  }

  if (digitsOnly.length === 10) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  }

  return phone;
};

/**
 * 함수 이름: display
 * 설명: API 필드명이 환경마다 다를 때를 대비한 안전 출력 함수입니다.
 * 사용 예:
 *   display(item.mbrNm)
 *   display(item.techGrdNm, item.skillGrdNm)
 * 첫 번째 값이 비어있으면 다음 값으로 대체해서 보여줍니다.
 */
const display = (...values: Array<string | number | undefined>) => {
  const found = values.find((v) => v !== undefined && v !== null && String(v).trim() !== '');
  return found !== undefined ? String(found) : '-';
};

/**
 * 함수 이름: selectMember
 * 설명: 목록의 한 줄을 클릭하면 그 멤버를 "선택 상태"로 저장합니다.
 * 목적:
 *   - 사용자가 수정 버튼을 눌렀을 때, 어떤 멤버를 수정할지 알기 위해 필요합니다.
 */
const selectMember = (member: MemDto) => {
  selectedMember.value = member;
};

/**
 * 함수 이름: goCreate
 * 설명: 신규 버튼 클릭 시 멤버등록 화면으로 이동합니다.
 * 신규 모드에서는 모든 입력칸이 활성화됩니다.
 */
const goCreate = () => {
  router.push({
    path: '/member/manage',
    query: { mode: 'create' }
  });
};

/**
 * 함수 이름: goEdit
 * 설명: 수정 버튼 클릭 시 멤버등록 화면으로 이동합니다.
 * 수정 모드에서는 이름/주민번호를 비활성화 처리하기 위해 mode=edit로 보냅니다.
 * 또한 화면에 미리 채울 값을 query로 함께 전달합니다.
 */
const goEdit = () => {
  if (!selectedMember.value) return;

  router.push({
    path: '/member/manage',
    query: {
      mode: 'edit',
      memId: display(selectedMember.value.memId, selectedMember.value.mbrId),
      memNm: display(selectedMember.value.memNm, selectedMember.value.mbrNm),
      mbrType: display(selectedMember.value.mbrType),
      mbrTypeNm: display(selectedMember.value.mbrTypeNm),
      birth: display(selectedMember.value.birth, selectedMember.value.birthDt, selectedMember.value.birthYmd),
      cellPhoneNum: display(
        selectedMember.value.cellPhoneNum,
        selectedMember.value.hpNo,
        selectedMember.value.mobileNo
      ),
      gnrlPhoneNum: display(selectedMember.value.gnrlPhoneNum || undefined, selectedMember.value.telNo)
    }
  });
};
</script>

<template>
  <div class="member-list-view">
    <h2>멤버리스트</h2>

    <!-- 검색 조건 영역 -->
    <div class="search-area">
      <div class="search-rows">
        <div class="search-row">
          <div class="search-item">
            <label>이름</label>
            <input
              v-model="searchParams.memNm"
              type="text"
              placeholder="이름 입력"
              @keyup.enter="handleSearch"
            />
          </div>

          <div class="search-item">
            <label>구분</label>
            <select v-model="searchParams.mbrType">
              <option value="">전체</option>
              <option v-for="opt in memberTypeOptions" :key="opt.cdVal" :value="opt.cdVal">
                {{ opt.cdValNm }}
              </option>
            </select>
          </div>

          <div class="search-item">
            <label>핸드폰번호</label>
            <input
              v-model="searchParams.cellPhoneNum"
              type="text"
              placeholder="숫자만 입력"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn-reset" :disabled="isLoading" @click="handleReset">초기화</button>
        <button class="btn-search" :disabled="isLoading" @click="handleSearch">
          {{ isLoading ? '조회중...' : '조회' }}
        </button>
      </div>
    </div>

    <!-- 목록 표 영역 -->
    <div class="grid-wrap">
      <div class="grid-area">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>이름</th>
              <th>구분</th>
              <th>생년월일</th>
              <th>남여</th>
              <th>휴대폰</th>
              <th>전화</th>
              <th>기술등급</th>
              <th>현재 프로젝트</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="errorMessage">
              <td colspan="10" class="no-data error-text">{{ errorMessage }}</td>
            </tr>
            <tr v-else-if="memberList.length === 0">
              <td colspan="10" class="no-data">
                {{ isLoading ? '데이터를 불러오는 중입니다...' : '조회된 데이터가 없습니다.' }}
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, idx) in memberList"
              :key="display(item.memId, item.mbrId, item.rowNum, idx + 1)"
              :class="{ 'row-selected': selectedMember === item }"
              @click="selectMember(item)"
            >
              <td>{{ display(item.rowNum, idx + 1) }}</td>
              <td>{{ display(item.memId, item.mbrId) }}</td>
              <td class="text-left">{{ display(item.memNm, item.mbrNm) }}</td>
              <td>{{ display(item.mbrTypeNm, item.mbrType) }}</td>
              <td>{{ formatDate(display(item.birth, item.birthDt, item.birthYmd)) }}</td>
              <td>{{ display(item.genderNm, item.birthGbn, item.gender) }}</td>
              <td>{{ formatPhone(display(item.cellPhoneNum, item.hpNo, item.mobileNo)) }}</td>
              <td>{{ display(item.gnrlPhoneNum || undefined, item.telNo) }}</td>
              <td>{{ display(item.techGrade || undefined, item.techGrdNm, item.skillGrdNm) }}</td>
              <td class="text-left">{{ display(item.currPrjNm, item.currentProjectNm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 캡처 화면 하단 페이징 자리 표시 -->
      <div class="paging-area">
        <div class="paging-placeholder"></div>
        <div class="paging-text">&lt; 1.2.3 ... n &gt;</div>
        <div class="action-buttons">
          <button class="btn-search" @click="goCreate">신규</button>
          <button class="btn-search" :disabled="!selectedMember" @click="goEdit">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.member-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-area {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.search-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
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
  min-width: 60px;
}

.search-item input,
.search-item select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 32px;
}

.search-item input {
  min-width: 180px;
}

.search-item select {
  min-width: 140px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-search {
  background-color: #007bff;
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

.btn-reset {
  background-color: #6c757d;
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

.grid-wrap {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.grid-area {
  min-height: 240px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1080px;
}

.data-table th,
.data-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  text-align: center;
}

.data-table th {
  background-color: #f1f3f5;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.row-selected {
  background-color: #dfefff !important;
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

.paging-area {
  height: 62px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.paging-placeholder {
  width: 140px;
}

.paging-text {
  flex: 1;
  text-align: center;
}

.action-buttons {
  width: 140px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
