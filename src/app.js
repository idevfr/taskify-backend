import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors({ origin: process.env.CORS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "working" });
});
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);
import mainTodoRouter from "./routes/main-todo.routes.js";
app.use("/api/v1/todo", mainTodoRouter);
import subTodoRouter from "./routes/sub-toodo.routes.js";
app.use("/api/v1/todo/:id/sub", subTodoRouter);
import { erroHandler } from "./middlewares/errorHandler.middeware.js";
app.use(erroHandler);
export default app;
