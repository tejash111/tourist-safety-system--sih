import jwt from "jsonwebtoken";
import User from "../models/index.js";

const userAuthVerification = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token, "token");

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    console.log(decoded, "decoded");

    const userInfo = await User.findById(decoded.id);
    console.log(userInfo, "userInfo");

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = userInfo;
    req.userId = userInfo._id;

    next(); //
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
};

export default userAuthVerification;
