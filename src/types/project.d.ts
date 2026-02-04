/*
  파일 이름: types/project.d.ts
  설명: 프로젝트 데이터(DTO)의 모양(타입)을 정의하는 약속 문서입니다.
  역할:
    - 서버에서 받아올 데이터가 어떤 필드들을 가지고 있는지 미리 정의합니다.
    - 오타를 방지하고, 코드를 작성할 때 자동 완성을 도와줍니다.
*/

export interface PrjDto {
  rowNum: string;      // 순번 (추가)
  prjId: string;       // 프로젝트 ID
  prjNm: string;       // 프로젝트명
  prjGbn: string;      // 프로젝트 구분
  prjGbnNm: string;    // 프로젝트 구분명 (추가)
  prjStrDt: string;    // 시작일
  prjEndDt: string;    // 종료일
  prjStsCd: string;    // 상태 코드
  prjStsNm: string;    // 상태명 (추가)
  prjDesc: string;     // 프로젝트 설명
  officeLoc: string;   // 근무지 위치
  officeLocNm: string; // 근무지 위치명 (추가)
  bizPrtnr: string;    // 주관사
  bizPrtnrNm: string;  // 주관사명 (추가)
}

export interface PrjReqDto {
  prjNm?: string;      // 프로젝트명
  prjGbn?: string;     // 프로젝트 구분
  prjStrDt?: string;   // 시작일
  prjEndDt?: string;   // 종료일
  prjStsCd?: string;   // 상태 코드
  officeLoc?: string;  // 근무지 위치
  bizPrtnr?: string;   // 주관사
}
