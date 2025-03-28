import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    name: String;
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true}
    password: { type: String, required: true }
})