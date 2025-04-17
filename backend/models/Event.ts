import mongoose, { type Document, Schema } from "mongoose"

export interface IEvent extends Document {
  title: string
  startTime: string
  endTime: string
  description: string
  location: string
  color: string
  day: number
  date: Date
  calendar: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  attendees: string[]
  organizer: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "bg-blue-500",
    },
    day: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    calendar: {
      type: Schema.Types.ObjectId,
      ref: "Calendar",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: {
      type: [String],
      default: [],
    },
    organizer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IEvent>("Event", EventSchema)
