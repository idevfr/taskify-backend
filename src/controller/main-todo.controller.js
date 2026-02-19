import { asyncHandler } from "../helpers/asyncHandler.js";
import { ApiResponse } from "../helpers/apiResponse.js";
import { ApiError } from "../helpers/apiError.js";
import { MainTodo } from "../models/main-todo.model.js";
import { User } from "../models/user.model.js";
import mongoose, { Mongoose } from "mongoose";
export const createMainTodo = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    throw new ApiError(401, "user is not authenticated");
  }
  const { title } = req.body;
  if (!title) {
    throw new ApiError(400, "title is required");
  }
  const user = await User.findById(loggedInUser._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const mainTodoData = await MainTodo.create({ title: title, owner: user._id });
  if (!mainTodoData) {
    throw new ApiError(500, "failed creating todo :(");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, mainTodoData, "todo created successfully"));
});
export const deleteMainTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "todo id is missing");
  }
  const deletedTodo = await MainTodo.findOneAndDelete({
    _id: id,
    owner: req.user?._id,
  });
  if (!deletedTodo) {
    throw new ApiError(404, "todo not found !");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "todo deleted successfully"));
});
export const getTasks = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "todo id is required");
  }
  const [tasks] = await MainTodo.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(loggedInUser?._id),
      },
    },
    {
      $lookup: {
        from: "subtodos",
        localField: "_id",
        foreignField: "belongsTo",
        as: "tasks",
      },
    },
    {
      $project: {
        tasks: 1,
      },
    },
  ]);
  if (!tasks) {
    throw new ApiError(404, "task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "fetched all the tasks successfully"));
});
export const getTodos = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    throw new ApiError(401, "user is not authenticated");
  }
  const todos = await MainTodo.find({ owner: loggedInUser._id });
  if (!todos.length) {
    throw new ApiError(404, "no todo found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, todos, "all todos fetched successfully"));
});
