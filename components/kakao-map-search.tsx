"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

type KakaoMapSearchProps = {
  onSelectLocation: (location: { address: string; placeName?: string }) => void;
  onClose: () => void;
};

export default function KakaoMapSearch({ onSelectLocation, onClose }: KakaoMapSearchProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=6a48322dfa726c2787faec174e2b39ae&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
            level: 3,
          };
          const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
          setMap(mapInstance);
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 장소 검색
  const searchPlaces = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map) return;

    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(searchQuery, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(result);

        // 기존 마커 제거
        markers.forEach((marker) => marker.setMap(null));

        // 새 마커 생성
        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = result.map((place: any) => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: position,
          });

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
          });

          // 마커에 마우스오버 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          // 마커에 마우스아웃 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });

          bounds.extend(position);
          return marker;
        });

        setMarkers(newMarkers);
        map.setBounds(bounds);
      } else {
        setSearchResults([]);
      }
    });
  };

  // 장소 선택
  const handleSelectPlace = (place: any) => {
    onSelectLocation({
      address: place.address_name || place.road_address_name,
      placeName: place.place_name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl p-6 w-full max-w-3xl text-white modal-animation">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">위치 검색</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={searchPlaces} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="장소 검색 (예: 강남역, 카페, 식당 등)"
              className="w-full bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors hover:shadow-md"
            >
              검색
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3 gap-4 h-[500px]">
          {/* 검색 결과 목록 */}
          <div className="col-span-1 bg-white/10 dark:bg-gray-700/30 rounded-md p-2 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center text-white/70 py-4">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>검색 결과가 없습니다</p>
              </div>
            ) : (
              <ul>
                {searchResults.map((place, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-white/10 dark:hover:bg-gray-600/30 rounded-md cursor-pointer mb-1 transition-all hover:translate-x-1"
                    onClick={() => handleSelectPlace(place)}
                  >
                    <div className="font-medium">{place.place_name}</div>
                    <div className="text-xs text-white/70 mt-1">{place.road_address_name || place.address_name}</div>
                    {place.phone && <div className="text-xs text-white/70">{place.phone}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 지도 */}
          <div className="col-span-2 bg-white/10 dark:bg-gray-700/30 rounded-md overflow-hidden">
            <div ref={mapRef} className="w-full h-full"></div>
          </div>
        </div>

        <div className="mt-4 text-xs text-white/50">* 카카오맵 API를 사용하여 위치 정보를 제공합니다.</div>
      </div>
    </div>
  );
}
