import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Required_SignIn
export const requireSignin = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "JWT must be provided" });
  }
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in signIn middleware!",
    });
  }
};
