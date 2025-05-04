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

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
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

const Notification = mongoose.model<INotification>("Notification", notificationSchema)

export default Notification
