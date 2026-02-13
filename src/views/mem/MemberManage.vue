<!--
  파일 이름: MemberManage.vue
  설명: 멤버 등록/수정 화면입니다.
  역할:
    - 리스트 화면에서 전달받은 mode(create/edit)에 따라 입력칸 활성/비활성을 제어합니다.
    - 하단 경력 그리드를 직접 입력하거나 CSV(엑셀 저장 파일) 업로드로 채울 수 있습니다.
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import { getCommCdList } from '@/api/common';
import type { CommCdDto } from '@/types/common';

// 라우터/현재 라우트 정보 객체
const router = useRouter();
const route = useRoute();

// 공통코드(MBR_TYPE) 옵션
const memberTypeOptions = ref<CommCdDto[]>([]);

// 업로드 결과 메시지
const uploadMessage = ref('');

// 신규/수정 모드 판별
const isEditMode = computed(() => String(route.query.mode || 'create') === 'edit');

// 상단 입력 폼 상태
const form = ref({
  memId: '',
  memNm: '',
  mbrType: '',
  rrnFront: '',
  rrnBack: '',
  cellPhoneNum: '',
  gnrlPhoneNum: ''
});

// 하단 경력 그리드 한 줄 타입
interface CareerRow {
  projectName: string;
  type: string;
  company: string;
  industry: string;
  from: string;
  to: string;
  mm: string;
  output: string;
  skill: string;
  role: string;
  note: string;
}

// 경력 그리드 데이터
const careerRows = ref<CareerRow[]>([]);

// 화면 진입 시 실행
onMounted(async () => {
  // 구분 콤보박스 옵션 로딩
  const result: any = await getCommCdList('MBR_TYPE');
  const codes = result.data || result;
  if (codes['MBR_TYPE']) {
    memberTypeOptions.value = codes['MBR_TYPE'];
  }

  // 리스트에서 전달받은 값으로 화면 초기값 세팅
  hydrateFormFromQuery();
});

/**
 * 함수 이름: hydrateFormFromQuery
 * 설명:
 *   리스트 화면에서 query로 전달된 값을 등록/수정 폼에 채웁니다.
 *   수정 모드일 때 이름/주민번호는 비활성화되며, 값은 여기서 미리 채워집니다.
 */
const hydrateFormFromQuery = () => {
  const memNm = String(route.query.memNm || '');
  const mbrType = String(route.query.mbrType || '');
  const memId = String(route.query.memId || '');
  const birth = String(route.query.birth || '');
  const cellPhoneNum = String(route.query.cellPhoneNum || '');
  const gnrlPhoneNum = String(route.query.gnrlPhoneNum || '');

  form.value.memNm = memNm !== '-' ? memNm : '';
  form.value.mbrType = mbrType !== '-' ? mbrType : '';
  form.value.memId = memId !== '-' ? memId : '';
  form.value.cellPhoneNum = cellPhoneNum !== '-' ? cellPhoneNum : '';
  form.value.gnrlPhoneNum = gnrlPhoneNum !== '-' ? gnrlPhoneNum : '';

  // birth(YYYYMMDD)가 넘어오면 주민번호 앞 6자리를 채웁니다.
  if (birth && birth !== '-' && birth.length >= 6) {
    form.value.rrnFront = birth.substring(2, 8); // 예: 20000101 -> 000101
  }
};

/**
 * 함수 이름: addCareerRow
 * 설명: 그리드 맨 마지막에 입력 가능한 빈 행을 1개 추가합니다.
 */
const addCareerRow = () => {
  careerRows.value.push({
    projectName: '',
    type: '',
    company: '',
    industry: '',
    from: '',
    to: '',
    mm: '',
    output: '',
    skill: '',
    role: '',
    note: ''
  });
};

/**
 * 함수 이름: mapToCareerRow
 * 설명:
 *   파싱된 행 배열(string[])을 화면 그리드 타입(CareerRow)으로 변환합니다.
 *   컬럼 순서는 화면 표 순서와 동일하다고 가정합니다.
 */
const mapToCareerRow = (row: string[]): CareerRow => ({
  projectName: row[0] || '',
  type: row[1] || '',
  company: row[2] || '',
  industry: row[3] || '',
  from: row[4] || '',
  to: row[5] || '',
  mm: row[6] || '',
  output: row[7] || '',
  skill: row[8] || '',
  role: row[9] || '',
  note: row[10] || ''
});

/**
 * 함수 이름: isHeaderRow
 * 설명:
 *   첫 줄이 헤더인지 간단히 판별합니다.
 *   "프로젝트", "project", "유형" 같은 키워드가 있으면 헤더로 판단합니다.
 */
const isHeaderRow = (row: string[]) => {
  const joined = row.join(' ').toLowerCase();
  return joined.includes('프로젝트') || joined.includes('project') || joined.includes('유형');
};

/**
 * 함수 이름: applyParsedRows
 * 설명:
 *   파싱 결과를 실제 그리드 데이터(careerRows)에 반영합니다.
 *   - 빈 행 제거
 *   - 첫 줄 헤더 제거(있을 경우)
 */
const applyParsedRows = (rows: string[][]) => {
  const cleaned = rows
    .map((row) => row.map((cell) => String(cell ?? '').trim()))
    .filter((row) => row.some((cell) => cell.length > 0));

  if (cleaned.length === 0) {
    careerRows.value = [];
    uploadMessage.value = '업로드한 파일에 데이터가 없습니다.';
    return;
  }

  const firstRow = cleaned[0];
  const dataRows = firstRow && isHeaderRow(firstRow) ? cleaned.slice(1) : cleaned;
  careerRows.value = dataRows.map(mapToCareerRow);
  uploadMessage.value = `${careerRows.value.length}건을 업로드했습니다.`;
};

/**
 * 함수 이름: parseCsvLine
 * 설명:
 *   CSV 한 줄을 배열로 나눕니다.
 *   따옴표(")로 감싼 값 안의 콤마는 데이터로 유지되도록 처리합니다.
 */
const parseCsvLine = (line: string): string[] => {
  const cols: string[] = [];
  let buffer = '';
  let insideQuote = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (insideQuote && line[i + 1] === '"') {
        buffer += '"';
        i += 1;
      } else {
        insideQuote = !insideQuote;
      }
      continue;
    }

    if (ch === ',' && !insideQuote) {
      cols.push(buffer.trim());
      buffer = '';
      continue;
    }

    buffer += ch;
  }

  cols.push(buffer.trim());
  return cols;
};

/**
 * 함수 이름: handleUploadFile
 * 설명:
 *   파일 업로드 시 확장자에 따라 CSV 또는 엑셀(xlsx/xls)을 읽어서 그리드에 반영합니다.
 */
const handleUploadFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  uploadMessage.value = '';
  if (!file) return;

  const lowerName = file.name.toLowerCase();
  const isCsv = lowerName.endsWith('.csv');
  const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

  if (!isCsv && !isExcel) {
    uploadMessage.value = '지원하지 않는 파일 형식입니다. (.csv, .xlsx, .xls만 가능)';
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    try {
      if (isCsv) {
        const text = String(loadEvent.target?.result || '');
        const lines = text
          .split(/\r?\n/)
          .map((v) => v.trim())
          .filter((v) => v.length > 0);

        const parsed = lines.map(parseCsvLine);
        applyParsedRows(parsed);
      } else {
        const arrayBuffer = loadEvent.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          uploadMessage.value = '엑셀 시트를 찾을 수 없습니다.';
          return;
        }
        const firstSheet = workbook.Sheets[firstSheetName];
        if (!firstSheet) {
          uploadMessage.value = '엑셀 첫 번째 시트를 읽을 수 없습니다.';
          return;
        }

        // header:1 옵션으로 "2차원 배열" 형태로 읽어옵니다.
        const rawRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(firstSheet, {
          header: 1,
          raw: false,
          defval: ''
        });

        const parsed = rawRows.map((row) => row.map((cell) => String(cell ?? '')));
        applyParsedRows(parsed);
      }
    } catch (error) {
      console.error('파일 업로드 파싱 실패:', error);
      uploadMessage.value = '파일 파싱 중 오류가 발생했습니다. 파일 형식과 내용을 확인해주세요.';
    } finally {
      input.value = '';
    }
  };

  if (isCsv) {
    reader.readAsText(file, 'utf-8');
  } else {
    reader.readAsArrayBuffer(file);
  }
};

/**
 * 함수 이름: handleSave
 * 설명:
 *   저장 버튼 클릭 시 호출됩니다.
 *   현재는 화면 샘플 단계이므로 콘솔 로그로 데이터 확인만 수행합니다.
 */
const handleSave = () => {
  console.log('저장 요청 데이터(샘플):', {
    form: form.value,
    careers: careerRows.value
  });
  uploadMessage.value = '저장 API 연결 전 단계입니다. 콘솔에서 요청 데이터를 확인해주세요.';
};

// 리스트 화면으로 돌아가기
const goList = () => {
  router.push('/member/list');
};
</script>

<template>
  <div class="member-manage-view">
    <h2>멤버등록</h2>

    <div class="form-area">
      <div class="form-row">
        <div class="form-item">
          <label>이름</label>
          <input
            v-model="form.memNm"
            type="text"
            placeholder="이름 입력"
            :disabled="isEditMode"
          />
        </div>

        <div class="form-item">
          <label>구분</label>
          <select v-model="form.mbrType">
            <option value="">선택</option>
            <option v-for="opt in memberTypeOptions" :key="opt.cdVal" :value="opt.cdVal">
              {{ opt.cdValNm }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-item">
          <label>주민번호</label>
          <div class="rrn-wrap">
            <input
              v-model="form.rrnFront"
              type="text"
              placeholder="000000"
              maxlength="6"
              :disabled="isEditMode"
            />
            <span>-</span>
            <input
              v-model="form.rrnBack"
              type="text"
              placeholder="0"
              maxlength="1"
              :disabled="isEditMode"
            />
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-item">
          <label>휴대폰번호</label>
          <input v-model="form.cellPhoneNum" type="text" placeholder="010-0000-0000" />
        </div>
        <div class="form-item">
          <label>전화번호</label>
          <input v-model="form.gnrlPhoneNum" type="text" placeholder="02-0000-0000" />
        </div>
      </div>
    </div>

    <div class="grid-control-area">
      <div class="left-controls">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          @change="handleUploadFile"
        />
        <span class="helper-text">CSV 또는 엑셀 파일(.xlsx, .xls) 업로드가 가능합니다.</span>
      </div>
      <div class="right-controls">
        <button class="btn-reset" @click="addCareerRow">행 추가</button>
      </div>
    </div>

    <p v-if="uploadMessage" class="upload-msg">{{ uploadMessage }}</p>

    <div class="grid-area">
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>프로젝트명</th>
            <th>유형</th>
            <th>관련회사</th>
            <th>산업</th>
            <th>From</th>
            <th>To</th>
            <th>담당개월</th>
            <th>솔루션</th>
            <th>Skill</th>
            <th>업무</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="careerRows.length === 0">
            <td colspan="12" class="no-data">행 추가 또는 CSV 업로드를 해주세요.</td>
          </tr>
          <tr v-else v-for="(row, idx) in careerRows" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td><input v-model="row.projectName" class="cell-input" /></td>
            <td><input v-model="row.type" class="cell-input" /></td>
            <td><input v-model="row.company" class="cell-input" /></td>
            <td><input v-model="row.industry" class="cell-input" /></td>
            <td><input v-model="row.from" class="cell-input" /></td>
            <td><input v-model="row.to" class="cell-input" /></td>
            <td><input v-model="row.mm" class="cell-input" /></td>
            <td><input v-model="row.output" class="cell-input" /></td>
            <td><input v-model="row.skill" class="cell-input" /></td>
            <td><input v-model="row.role" class="cell-input" /></td>
            <td><input v-model="row.note" class="cell-input" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="btn-group">
      <button class="btn-reset" @click="goList">목록</button>
      <button class="btn-search" @click="handleSave">저장</button>
    </div>
  </div>
</template>

<style scoped>
.member-manage-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-area {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-item label {
  font-weight: bold;
  font-size: 14px;
  color: #555;
  min-width: 75px;
}

.form-item input,
.form-item select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 32px;
  min-width: 180px;
}

.form-item input:disabled {
  background-color: #eceff1;
  color: #666;
}

.rrn-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rrn-wrap input:first-child {
  min-width: 100px;
}

.rrn-wrap input:last-child {
  min-width: 60px;
}

.grid-control-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helper-text {
  color: #666;
  font-size: 13px;
}

.upload-msg {
  margin: 0;
  color: #2e7d32;
  font-size: 13px;
}

.grid-area {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.data-table th,
.data-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 13px;
}

.data-table th {
  background-color: #f1f3f5;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.cell-input {
  width: 100%;
  min-width: 80px;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  padding: 4px 6px;
  height: 28px;
  font-size: 12px;
  box-sizing: border-box;
}

.no-data {
  padding: 30px;
  color: #999;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
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
</style>
