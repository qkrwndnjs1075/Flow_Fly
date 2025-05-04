import mongoose, { type Document, Schema } from "mongoose"

export interface ICalendar extends Document {
  name: string
  color: string
  user: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const calendarSchema = new Schema<ICalendar>(
  {
    name: {
      type: String,
      required: [true, "Calendar name is required"],
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

const Calendar = mongoose.model<ICalendar>("Calendar", calendarSchema)

export default Calendar
