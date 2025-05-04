"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useApi() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useCallback(
    async <T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
      const { method = "GET", body, headers = {} } = options;
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const url = `${apiUrl}/${endpoint}`;

        // 인증 토큰 추가
        const authHeaders: Record<string, string> = {};
        if (session?.accessToken) {
          authHeaders["Authorization"] = `Bearer ${session.accessToken}`;
        }

        // 요청 헤더 설정
        const requestHeaders = {
          ...authHeaders,
          ...headers,
        };

        // GET 요청이 아닌 경우 Content-Type 설정
        if (method !== "GET" && body && !headers["Content-Type"]) {
          requestHeaders["Content-Type"] = "application/json";
        }

        // 요청 옵션 구성
        const requestOptions: RequestInit = {
          method,
          headers: requestHeaders,
          credentials: "include",
        };

        // GET 요청이 아니고 body가 있는 경우 JSON 문자열로 변환
        if (method !== "GET" && body) {
          requestOptions.body = JSON.stringify(body);
        }

        console.log(`API 요청: ${url}`, { method, headers: requestHeaders });

        const response = await fetch(url, requestOptions);

        // 응답 상태 확인
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API 오류 (${endpoint}): ${response.status} ${response.statusText}`, errorText);
          throw new Error(errorText || `API 요청 실패: ${response.status}`);
        }

        // 응답이 비어있는지 확인
        const text = await response.text();
        if (!text) {
          console.log(`API 응답이 비어있음: ${endpoint}`);
          return { success: true, data: {} as T };
        }

        // JSON 파싱 시도
        try {
          const data = JSON.parse(text);
          console.log(`API 응답: ${endpoint}`, data);
          return { success: true, data };
        } catch (jsonError) {
          console.error(`JSON 파싱 오류 (${endpoint}):`, text, jsonError);
          throw new Error(`JSON 파싱 오류: ${jsonError}`);
        }
      } catch (err: any) {
        const errorMessage = err.message || "API 요청 중 오류가 발생했습니다";
        console.error(`API 오류 (${endpoint}):`, err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  return { fetchApi, isLoading, error };
}
