import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  title: string
  message: string
  time: string
  read: boolean
  type: "reminder" | "invitation" | "update"
  user: mongoose.Types.ObjectId
  relatedEvent?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["reminder", "invitation", "update"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedEvent: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<INotification>("Notification", NotificationSchema)
