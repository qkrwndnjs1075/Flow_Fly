"use client";

import { PropsWithChildren, useEffect } from "react";
import ChannelService from "./channel-talk/channel-service";

const AppProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // 채널톡 스크립트 로드
    ChannelService.loadScript();

    // 플러그인 초기화
    ChannelService.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_KEY || "", // 환경 변수 사용
    });

    return () => {
      // 컴포넌트 언마운트 시 종료
      ChannelService.shutdown();
    };
  }, []);

  return <>{children}</>;
};

export default AppProvider;
