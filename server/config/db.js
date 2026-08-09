import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
