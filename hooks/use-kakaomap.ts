"use client"

import { useState } from "react"
import { useApi } from "./use-api"

interface KakaoMapPlace {
  id: string
  place_name: string
  address_name: string
  road_address_name: string
  phone: string
  x: string // longitude
  y: string // latitude
  category_name: string
  place_url: string
}

interface KakaoMapAddress {
  address_name: string
  address_type: string
  x: string // longitude
  y: string // latitude
  address: {
    address_name: string
    region_1depth_name: string
    region_2depth_name: string
    region_3depth_name: string
    main_address_no: string
    sub_address_no: string
  }
  road_address: {
    address_name: string
    region_1depth_name: string
    region_2depth_name: string
    region_3depth_name: string
    road_name: string
    underground_yn: string
    main_building_no: string
    sub_building_no: string
    building_name: string
    zone_no: string
  } | null
}

export function useKakaoMap() {
  const [isLoading, setIsLoading] = useState(false)
  const { fetchApi } = useApi()

  const searchPlaces = async (query: string): Promise<KakaoMapPlace[]> => {
    setIsLoading(true)
    try {
      const response = await fetchApi<{ success: boolean; places: KakaoMapPlace[] }>(
        `kakao-map/places?query=${encodeURIComponent(query)}`,
        { requiresAuth: true },
      )

      if (response.success && response.data?.places) {
        return response.data.places
      }
      return []
    } catch (error) {
      console.error("장소 검색 오류:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const searchAddress = async (query: string): Promise<KakaoMapAddress[]> => {
    setIsLoading(true)
    try {
      const response = await fetchApi<{ success: boolean; addresses: KakaoMapAddress[] }>(
        `kakao-map/address?query=${encodeURIComponent(query)}`,
        { requiresAuth: true },
      )

      if (response.success && response.data?.addresses) {
        return response.data.addresses
      }
      return []
    } catch (error) {
      console.error("주소 검색 오류:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    searchPlaces,
    searchAddress,
  }
}
