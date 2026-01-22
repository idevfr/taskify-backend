import jwt from "jsonwebtoken";
export const verifyJWT = async function (req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!decodedToken) {
      throw new Error("failed decoding token ");
    }
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
