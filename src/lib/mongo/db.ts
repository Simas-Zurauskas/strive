import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function mongoDb() {
  try {
    mongoose.set('strictQuery', true);
    mongoose.set('strictPopulate', false);
    mongoose.set('bufferCommands', false);
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        connectTimeoutMS: 10000,
      };

      console.log('Connecting to MongoDB...', { isVercel: !!process.env.VERCEL });

      cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Unable to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default mongoDb;
