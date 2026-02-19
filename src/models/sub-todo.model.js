import mongoose from "mongoose";
import { MainTodo } from "./main-todo.model.js";
const subTodoSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    completeWithin: {
      type: Date,
    },
    belongsTo: {
      type: mongoose.Types.ObjectId,
      ref: "MainTodo",
      required: true,
    },
  },
  { timestamps: true },
);
subTodoSchema.pre("save", async function () {
  await MainTodo.findByIdAndUpdate(this.belongsTo, {
    $push: { todos: this._id },
  });
});
subTodoSchema.pre("findOneAndDelete", async function () {
  const task = await this.model.findOne(this.getFilter());
  await MainTodo.findByIdAndUpdate(task.belongsTo, {
    $pull: { todos: task._id },
  });
});
export const SubTodo = mongoose.model("SubTodo", subTodoSchema);
