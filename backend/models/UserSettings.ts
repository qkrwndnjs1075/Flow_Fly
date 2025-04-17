import mongoose, { type Document, Schema } from "mongoose"

export interface IUserSettings extends Document {
  user: mongoose.Types.ObjectId
  darkMode: boolean
  notifications: boolean
  timeFormat: "12h" | "24h"
  startOfWeek: "sunday" | "monday"
  createdAt: Date
  updatedAt: Date
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    timeFormat: {
      type: String,
      enum: ["12h", "24h"],
      default: "12h",
    },
    startOfWeek: {
      type: String,
      enum: ["sunday", "monday"],
      default: "sunday",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema)
