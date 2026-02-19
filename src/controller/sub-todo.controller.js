import { asyncHandler } from "../helpers/asyncHandler.js";
import { ApiResponse } from "../helpers/apiResponse.js";
import { ApiError } from "../helpers/apiError.js";
import { SubTodo } from "../models/sub-todo.model.js";
import { MainTodo } from "../models/main-todo.model.js";
export const createSubTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "id not provided");
  }
  const { taskName, completeWithin } = req.body;
  if (!taskName) {
    throw new ApiError(400, "task name is required");
  }
  const mainTodo = await MainTodo.findById(id);
  if (!mainTodo) {
    throw new ApiError(404, "no todo found , failed creating task");
  }
  let taskObj;
  if (completeWithin) {
    taskObj = {
      taskName,
      completeWithin,
      belongsTo: mainTodo._id,
    };
  } else {
    taskObj = {
      taskName,
      belongsTo: mainTodo._id,
    };
  }
  const subTodo = await SubTodo.create(taskObj);
  if (!subTodo) {
    throw new ApiError(500, "failed creating task :(");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subTodo, "task created successfully"));
});
export const deleteSubTodo = asyncHandler(async (req, res) => {
  const { id, taskId } = req.params;
  if (!taskId || !id) {
    throw new ApiError(400, "task id is missing");
  }
  const taskToBeDeleted = await SubTodo.findOneAndDelete({
    _id: taskId,
    belongsTo: id,
  });
  if (!taskToBeDeleted) {
    throw new ApiError(500, "failed deleting task");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "task deleted successfully"));
});
