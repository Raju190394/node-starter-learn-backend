// src/common/config/mongo.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://romanchalnayak_db_user:1wP5TKCnU2SdKsa9@cluster0.ojtzwjr.mongodb.net/?appName=Cluster0";

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Create a MongoClient with stable API options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectMongo = async () => {
  try {
    await client.connect();
    // Verify connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    throw e;
  }
  return client;
};

export default client;
