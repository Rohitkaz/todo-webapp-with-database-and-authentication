import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
}
