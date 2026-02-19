import express from "express";
import {
  createSubTodo,
  deleteSubTodo,
} from "../controller/sub-todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const Router = express.Router({ mergeParams: true });
Router.route("/create").post(verifyJWT, createSubTodo);
Router.route("/delete/:taskId").post(verifyJWT, deleteSubTodo);
export default Router;
