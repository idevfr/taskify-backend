import { asyncHandler } from "../helpers/asyncHandler.js";
import { ApiError } from "../helpers/apiError.js";
import { ApiResponse } from "../helpers/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateTokens } from "../helpers/generateTokens.js";
import {
  refrehCookieOptions,
  accessCookieOptions,
} from "../helpers/constants.js";
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, fullName, username } = req.body;
  if (
    !email ||
    !password ||
    !fullName ||
    !username ||
    [email, username, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "some of the required fields are empty");
  }
  const userAlreadyExist = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (userAlreadyExist) {
    throw new ApiError(400, "user already exists");
  }

  let avatarUrl;
  if (req.file) {
    const localPath = req.file?.path;
    try {
      const url = await uploadToCloudinary(localPath);
      avatarUrl = url;
    } catch (error) {
      throw new ApiError(500, error);
    }
  }
  const userObj = {
    email: email,
    username: username,
    password: password,
    fullName: fullName,
    avatar: avatarUrl || "",
  };
  const user = await User.create(userObj);
  const resObj = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, resObj, "user registerd successfully"));
});
export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "email or username is required");
  }
  const user = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect");
  }
  const { accessToken, refreshToken } = await generateTokens(user?._id);
  return res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refrehCookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
          },
          refreshToken,
          accessToken,
        },
        "user logged in successfully",
      ),
    );
});
export const logoutUser = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    throw new ApiError(401, "user is not logged in");
  }
  const user = await User.findByIdAndUpdate(loggedInUser?._id, {
    refreshToken: "",
  });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});
export const updateUserAvatar = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    throw new ApiError(401, "user is not authenticated to perform this action");
  }
  const avatar = req.file?.avatar;
  if (!avatar) {
    throw new ApiError(404, "avatar image is required");
  }
  const updatedAvatar = await uploadToCloudinary(avatar?.path);
  const user = await User.findByIdAndUpdate(loggedInUser?._id, {
    avatar: updateUserAvatar?.url,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user has been updated successfully"));
});
export const getLoggedInUser = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    throw new ApiError(401, "user is not authenticated");
  }
  const user = await User.findById(loggedInUser._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "currently logged in user fetched successfully",
      ),
    );
});
