/*
  파일 이름: types/common.d.ts
  설명: 공통적으로 사용되는 데이터 모델을 정의합니다.
*/

export interface CommCdDto {
  cdVal: string;   // 공통 코드 값 (예: "10", "20")
  cdValNm: string; // 코드명 (예: "운영", "개발")
  grpCd?: string;  // 그룹 코드 (필요시)
}

// 그룹 코드 요청을 위한 인터페이스 (선택 사항, API 파라미터 타입으로 사용 가능)
export interface CommCdReqDto {
  grpCds: string; // 쉼표로 구분된 그룹 코드들
}
