/*
  파일 이름: api/common.ts
  설명: 공통 코드 등 공통적인 데이터 통신을 담당합니다.
*/

import axios from 'axios';
import type { CommCdDto } from '@/types/common';

// API 기본 주소 (proxy 설정에 따름)
const API_BASE_URL = '/api';

/**
 * 함수 이름: getCommCdList
 * 설명: 그룹 코드들을 받아 해당하는 공통 코드 목록을 가져옵니다.
 * 
 * @param grpCds 쉼표로 구분된 그룹 코드 문자열 (예: "PRJ_GBN,PRJ_STS_CD")
 * @returns 그룹 코드를 키로 하고 코드 목록을 값으로 하는 Map 객체 (실제로는 객체 형태)
 */
export const getCommCdList = async (grpCds: string): Promise<Record<string, CommCdDto[]>> => {
    try {
        console.log('공통 코드 요청:', grpCds);

        // GET /api/com/codes?grpCds=...
        const response = await axios.get<{ success: boolean; data: Record<string, CommCdDto[]>; error: any }>(`${API_BASE_URL}/com/codes`, {
            params: { grpCds }
        });

        console.log('공통 코드 응답:', response.data);

        // 서버 응답 구조: { success: true, data: { "PRJ_GBN": [...], ... } }
        return response.data.data;
    } catch (error) {
        console.error('공통 코드 조회 실패:', error);
        return {}; // 에러 발생 시 빈 객체 반환
    }
};
