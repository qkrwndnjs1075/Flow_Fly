import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: String;
  _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
