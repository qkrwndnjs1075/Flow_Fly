"use client";

import React, { createContext, useContext, useEffect } from "react";
import ChannelService from "./channel-talk/channel-service"; // 경로를 프로젝트에 맞게 조정

// 외부 서비스 연결을 위한 컨텍스트 타입 정의 (필요한 값들을 추가 가능)
type AppContextType = {};

// AppContext 생성
export const AppContext = createContext<AppContextType | undefined>(undefined);

// AppProvider 컴포넌트: 컨텍스트 제공과 함께 ChannelTalk 로드
export default function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 채널톡 스크립트 로드 및 부트
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_KEY || "", // 실제 플러그인 키를 환경 변수에 설정
    });

    return () => {
      // 컴포넌트 언마운트 시 채널톡 종료
      ChannelService.shutdown();
    };
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}

// 커스텀 훅: 컨텍스트 사용을 위한 헬퍼 함수
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
