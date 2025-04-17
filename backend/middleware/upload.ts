import multer from "multer"
import path from "path"
import fs from "fs"

// 업로드 디렉토리 생성
const uploadDir = "uploads/"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// 파일 필터링
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP만 허용됩니다."))
  }
}

// 업로드 제한
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
}

export const upload = multer({
  storage,
  fileFilter,
  limits,
})
