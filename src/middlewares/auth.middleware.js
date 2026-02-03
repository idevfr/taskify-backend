import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/apiError.js";
export const verifyJWT = async function (req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new ApiError(401, "user is not authenticated");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!decodedToken) {
      throw new Error("failed decoding token ");
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};
