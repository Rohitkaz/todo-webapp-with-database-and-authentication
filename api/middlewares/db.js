import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://wwwrahulveeru12345:jin%40kazama123@cluster0.i0rxtmb.mongodb.net/test"
    );
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
}
