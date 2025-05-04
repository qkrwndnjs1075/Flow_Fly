import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import axios from "axios"

// 카카오맵 장소 검색
export const searchPlaces = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query

  if (!query || typeof query !== "string") {
    res.status(400)
    throw new Error("검색어를 입력해주세요")
  }

  // 카카오맵 API 키
  const kakaoApiKey = process.env.KAKAO_API_KEY

  if (!kakaoApiKey) {
    res.status(500)
    throw new Error("카카오맵 API 키가 설정되지 않았습니다")
  }

  try {
    // 카카오맵 API 호출
    const response = await axios.get("https://dapi.kakao.com/v2/local/search/keyword.json", {
      params: {
        query,
      },
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    })

    res.json({
      success: true,
      places: response.data.documents,
    })
  } catch (error: any) {
    res.status(500)
    throw new Error(`카카오맵 API 오류: ${error.message}`)
  }
})

// 카카오맵 주소 검색
export const searchAddress = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query

  if (!query || typeof query !== "string") {
    res.status(400)
    throw new Error("검색어를 입력해주세요")
  }

  // 카카오맵 API 키
  const kakaoApiKey = process.env.KAKAO_API_KEY

  if (!kakaoApiKey) {
    res.status(500)
    throw new Error("카카오맵 API 키가 설정되지 않았습니다")
  }

  try {
    // 카카오맵 API 호출
    const response = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
      params: {
        query,
      },
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    })

    res.json({
      success: true,
      addresses: response.data.documents,
    })
  } catch (error: any) {
    res.status(500)
    throw new Error(`카카오맵 API 오류: ${error.message}`)
  }
})
