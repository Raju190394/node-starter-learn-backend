import mongoose from 'mongoose';
import 'dotenv/config';

const connectMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://romanchalnayak_db_user:1wP5TKCnU2SdKsa9@cluster0.ojtzwjr.mongodb.net/?appName=Cluster0");

    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectMongoDB;