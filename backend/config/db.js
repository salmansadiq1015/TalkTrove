import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Successfully connected to MongoDB : ${conn.connection.host}`.bgYellow
        .white
    );
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
