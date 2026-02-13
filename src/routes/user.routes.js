import express from "express";
import {
  getLoggedInUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
} from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
//
const Router = express.Router();
//
Router.route("/register").post(upload.single("avatar"), registerUser);
Router.route("/login").post(loginUser);
Router.route("/logout").post(verifyJWT, logoutUser);
Router.route("/update-avatar").post(verifyJWT, updateUserAvatar);
Router.route("/loggedin-user").get(verifyJWT, getLoggedInUser);
Router.route("/refresh-tokens").post(refreshAccessToken);
//
export default Router;
