import mongoose from "mongoose"

export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/flow_fly"

    const conn = await mongoose.connect(MONGODB_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : "Unknown error"}`)
    process.exit(1)
  }
}
