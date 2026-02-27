import express from "express";
import {
  createSubTodo,
  deleteSubTodo,
  getAllSubTodo,
} from "../controller/sub-todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const Router = express.Router({ mergeParams: true });
// in postman /api/v1/todo
// /api/v1/todo/:id/sub
Router.route("/create").post(verifyJWT, createSubTodo);
Router.route("/delete/:taskId").post(verifyJWT, deleteSubTodo);
Router.route("/get-all").get(verifyJWT, getAllSubTodo);
export default Router;
