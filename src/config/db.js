import mongoose from "mongoose";

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_API);
  console.log("MongoDB connected");
}

export default connectDB;
