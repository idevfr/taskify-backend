import express from "express";
import {
  createMainTodo,
  deleteMainTodo,
  getTasks,
  getTodos,
} from "../controller/main-todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const Router = express.Router({ mergeParams: true });
Router.route("/create").post(verifyJWT, createMainTodo);
Router.route("/delete/:id").post(verifyJWT, deleteMainTodo);
Router.route("/:id/tasks").get(verifyJWT, getTasks);
Router.route("/get-all").get(verifyJWT, getTodos);
export default Router;
