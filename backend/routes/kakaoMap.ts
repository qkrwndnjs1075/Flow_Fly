import express from "express"
import { searchPlaces, searchAddress } from "../controllers/kakaoMapController"
import { auth } from "../middleware/auth"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(auth)

// 카카오맵 장소 검색
router.get("/places", searchPlaces)

// 카카오맵 주소 검색
router.get("/address", searchAddress)

export default router
