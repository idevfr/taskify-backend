import { User } from "../models/user.model.js";
import { ApiError } from "./apiError.js";

export async function generateTokens(id) {
  try {
    if (!id) throw new Error("no user id passed for token generation");
    const user = await User.findById(id);
    if (!user) {
      throw new Error("no user found to generate token");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    if (!accessToken || !refreshToken) {
      throw new Error("failed generating access or refresh token");
    }
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "failed generating tokens", error);
  }
}
