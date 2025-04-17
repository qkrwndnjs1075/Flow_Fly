import mongoose, { type Document, Schema } from "mongoose"

export interface ICalendar extends Document {
  name: string
  color: string
  user: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CalendarSchema = new Schema<ICalendar>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "bg-blue-500",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ICalendar>("Calendar", CalendarSchema)
