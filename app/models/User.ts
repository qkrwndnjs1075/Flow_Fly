import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: String;
  imageUrl: String;
  _id: mongoose.Types.ObjectId;
  role: "user" | "admin";
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"], // Mongoose enum 정의
    default: "user",
    required: true,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
