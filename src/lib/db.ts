import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

declare global {
  const mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalWithMongoose = global as typeof global & {
  mongooseConn?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseConn) {
  globalWithMongoose.mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  if (globalWithMongoose.mongooseConn!.conn) {
    return globalWithMongoose.mongooseConn!.conn;
  }

  if (!globalWithMongoose.mongooseConn!.promise) {
    globalWithMongoose.mongooseConn!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalWithMongoose.mongooseConn!.conn =
    await globalWithMongoose.mongooseConn!.promise;

  return globalWithMongoose.mongooseConn!.conn;
}
