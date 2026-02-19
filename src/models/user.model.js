import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    username: { type: String, required: true, lowercase: true },
    fullName: { type: String, required: true },
    avatar: { type: String, default: "", trim: true },
    refreshToken: { type: String, default: "" },
    todoList: [{ type: mongoose.Types.ObjectId, ref: "MainTodo" }],
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
  } catch (error) {
    console.error(error);
  }
});
userSchema.methods.comparePassword = async function (password) {
  try {
    if (!password) {
      throw new Error("no password given ,failed compareing");
    }
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (error) {
    console.log(error);
    return false;
  }
};
userSchema.methods.generateAccessToken = function () {
  const acessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
      avatar: this.avatar,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_VALIDITY,
    },
  );
  return acessToken;
};
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_VALIDITY,
    },
  );
  return refreshToken;
};
export const User = model("User", userSchema);
