import { v2 as cloudinary } from "cloudinary";

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 폴더 타입 정의
type FolderType = "blog" | "user" | "portfolio" | "introduce";

export async function uploadImage(file: File, publicId: string, folder: FolderType): Promise<string> {
  if (!file) {
    throw new Error("Image file is required");
  }

  // 파일 형식 검증
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG or PNG images are allowed");
  }

  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size exceeds 5MB");
  }
  // 변환
  // 파일을 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cloudinary에 업로드
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: publicId, folder: folder }, // 폴더 지정
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return (uploadResult as any).secure_url;
}
