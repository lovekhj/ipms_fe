/*
  파일 이름: api/project.ts
  설명: 프로젝트와 관련된 서버 통신을 담당하는 파일입니다.
  역할:
    - Axios를 사용하여 서버에 요청을 보냅니다.
    - 프로젝트 리스트 조회 기능을 제공합니다.
*/

import axios from 'axios';
import type { PrjDto, PrjReqDto } from '@/types/project'; // 우리가 정의한 데이터 모양을 가져옵니다.

// API의 기본 주소를 설정합니다.
// vite.config.ts에서 설정한 proxy 규칙에 따라 '/api'로 시작하면 
// 자동으로 http://localhost:8080 으로 연결됩니다.
const API_BASE_URL = '/api';

/**
 * 함수 이름: getPrjList
 * 설명: 서버에서 프로젝트 목록을 가져오는 함수입니다.
 * 
 * @param params 검색 조건 (선택)
 * @returns 프로젝트 목록 데이터 (PrjDto 배열)
 */
export const getPrjList = async (params?: PrjReqDto): Promise<PrjDto[]> => {
    try {
        // axios.get을 사용하여 서버의 '/prj/list' 주소로 데이터를 요청합니다.
        // params를 전달하면 자동으로 쿼리 스트링(?prjNm=...&...)으로 변환되어 전송됩니다.

        // 요청 주소 확인용 로그
        console.log('API 요청 시작:', `${API_BASE_URL}/prj/list`, params);

        const response = await axios.get<{ success: boolean; data: PrjDto[]; error: any }>(`${API_BASE_URL}/prj/list`, {
            params: params, // 검색 조건 추가
        });
        console.log('API 응답 성공:', response.data);

        // 서버 응답 구조가 { success: true, data: [...], ... } 형태이므로
        // response.data.data를 반환해야 실제 리스트를 얻을 수 있습니다.
        return response.data.data;
    } catch (error) {
        console.error('API 상세 에러:', error);
        throw error;
    }
};
