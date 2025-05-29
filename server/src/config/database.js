import mongoose from "mongoose";

const DB_NAME = "Job-Portal";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
     `mongodb+srv://gaganyadav2k03:thegaganyadav840%40@pr01.78r3r.mongodb.net/`
    );

    console.log(
      `\nMongoDB is connectd !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB connection is Failed `, error);
    process.exit(1);
  }
};

export { connectDB };
