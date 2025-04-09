import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/app/models/User";
import { uploadImage } from "@/app/api/upload-image/route";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;

   
    if (!email || !password || !name || !imageFile) {
      return NextResponse.json({ message: "Email, password, name, and image are required" }, { status: 400 });
    }

    // 기존 사용자 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    
    const imageUrl = await uploadImage(imageFile, `${email}_profile`, "user");

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, imageUrl });

    
    await user.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user", error: (error as Error).message }, { status: 400 });
  }
}
