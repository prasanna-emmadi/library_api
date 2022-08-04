import mongoose from "mongoose";

export async function connectMongoose() {
  return await mongoose.connect("mongodb://localhost:27017/library");
}

export async function disconnectMongoose() {
  return await mongoose.connection.close();
}
