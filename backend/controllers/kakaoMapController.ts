import type { Request, Response } from "express"
import axios from "axios"

// 카카오맵 장소 검색
export const searchPlaces = async (req: Request, res: Response) => {
  try {
    const { query } = req.query

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "검색어를 입력해주세요" })
    }

    // 카카오맵 API 키
    const kakaoApiKey = process.env.KAKAO_API_KEY

    if (!kakaoApiKey) {
      return res.status(500).json({ message: "카카오맵 API 키가 설정되지 않았습니다" })
    }

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
    res.status(500).json({ message: error.message })
  }
}

// 카카오맵 주소 검색
export const searchAddress = async (req: Request, res: Response) => {
  try {
    const { query } = req.query

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "검색어를 입력해주세요" })
    }

    // 카카오맵 API 키
    const kakaoApiKey = process.env.KAKAO_API_KEY

    if (!kakaoApiKey) {
      return res.status(500).json({ message: "카카오맵 API 키가 설정되지 않았습니다" })
    }

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
    res.status(500).json({ message: error.message })
  }
}
