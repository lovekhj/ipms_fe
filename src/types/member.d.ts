/*
  파일 이름: types/member.d.ts
  설명: 멤버 화면에서 사용할 데이터 모양(타입)을 정의하는 파일입니다.
  역할:
    - 서버에서 내려주는 멤버 데이터가 어떤 칸으로 구성되는지 약속합니다.
    - 코드 작성 중 오타를 줄이고, 자동 완성을 쉽게 받기 위해 사용합니다.
*/

// 멤버 한 줄(행) 데이터 타입
export interface MemDto {
  rowNum?: string | number;      // 목록 순번
  memId?: string;                // 멤버 ID (실제 응답 필드)
  memNm?: string;                // 멤버 이름 (실제 응답 필드)
  mbrId?: string;                // 멤버 ID
  mbrNm?: string;                // 멤버 이름
  mbrType?: string;              // 멤버 구분 코드
  mbrTypeNm?: string;            // 멤버 구분명
  birth?: string;                // 생년월일 (실제 응답 필드, 예: 19900101)
  birthDt?: string;              // 생년월일 (예: 19900101)
  birthYmd?: string;             // 생년월일 (대체 필드명 가능성)
  birthGbn?: string;             // 남/여 코드 (실제 응답 필드)
  gender?: string;               // 성별 코드
  genderNm?: string;             // 성별명 (남/여)
  cellPhoneNum?: string;         // 휴대폰 번호 (실제 응답 필드)
  hpNo?: string;                 // 휴대폰 번호
  mobileNo?: string;             // 휴대폰 번호 (대체 필드명 가능성)
  gnrlPhoneNum?: string | null;  // 일반 전화번호 (실제 응답 필드)
  telNo?: string;                // 전화번호
  techGrade?: string | null;     // 기술등급 (실제 응답 필드)
  techGrdNm?: string;            // 기술등급명
  skillGrdNm?: string;           // 기술등급명 (대체 필드명 가능성)
  currPrjNm?: string;            // 현재 프로젝트명
  currentProjectNm?: string;     // 현재 프로젝트명 (대체 필드명 가능성)
}

// 조회 조건(검색 조건) 타입
export interface MemReqDto {
  memNm?: string;         // 이름 검색어 (조회 파라미터)
  mbrType?: string;       // 멤버 구분 코드 (조회 파라미터)
  cellPhoneNum?: string;  // 휴대폰 번호 (조회 파라미터)
  mbrNm?: string;         // 기존 호환용 (필요 시)
}
