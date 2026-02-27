import mongoose from "mongoose";
import { User } from "./user.model.js";
import { SubTodo } from "./sub-todo.model.js";
const mainTodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

mainTodoSchema.pre("findOneAndDelete", async function () {
  const todo = await this.model.findOne(this.getFilter());
  await User.findOneAndUpdate(todo.owner, { $pull: { todoList: todo._id } });
  await SubTodo.deleteMany({ _id: { $in: todo.todos } });
});
export const MainTodo = mongoose.model("MainTodo", mainTodoSchema);
