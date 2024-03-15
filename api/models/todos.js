import mongoose from "mongoose";

const schema = new mongoose.Schema({
  task: String,
  completed: String,
  user_id: String,
});
const todos = new mongoose.model("todos", schema);
export default todos;
