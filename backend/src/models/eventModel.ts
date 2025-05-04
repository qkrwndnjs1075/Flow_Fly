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

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
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

const Event = mongoose.model<IEvent>("Event", eventSchema)

export default Event
