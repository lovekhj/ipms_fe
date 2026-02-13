/*
  파일 이름: api/member.ts
  설명: 멤버 화면에서 사용하는 서버 통신 함수를 모아둔 파일입니다.
  역할:
    - 멤버 목록 조회 API(/api/mem/list)를 호출합니다.
*/

import axios from 'axios';
import type { MemDto, MemReqDto } from '@/types/member';

// vite proxy 규칙을 사용하기 위해 API 기본 경로를 '/api'로 둡니다.
const API_BASE_URL = '/api';

/**
 * 함수 이름: getMemList
 * 설명: 서버에서 멤버 목록을 가져옵니다.
 *
 * @param params 이름/구분 검색 조건
 * @returns 멤버 목록 배열
 */
export const getMemList = async (params?: MemReqDto): Promise<MemDto[]> => {
  try {
    console.log('멤버 목록 요청 시작:', `${API_BASE_URL}/mem/list`, params);

    // 서버 응답을 { success, data, error } 형태로 가정합니다.
    const response = await axios.get<{ success: boolean; data: MemDto[]; error: any }>(
      `${API_BASE_URL}/mem/list`,
      { params }
    );

    console.log('멤버 목록 응답 성공:', response.data);

    // data가 배열이 아니면 화면에서 안전하게 처리하도록 빈 배열을 반환합니다.
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('멤버 목록 API 에러:', error);
    throw error;
  }
};
