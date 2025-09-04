import { User, Alert } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";
//genrate jwt token
const generateToken = (getId) => {
  return jwt.sign({ id: getId }, "SECRET_KEY", { expiresIn: "7d" });
};

const RegisterUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    } else {
      //hashpasasowrd
      const hashedPassword = await bcrypt.hash(password, 10); //10 is salt both in single line

      const newlyCreatedUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      if (newlyCreatedUser) {
        const token = generateToken(newlyCreatedUser?._id);

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          success: true,
          message: "user registered successfully",
          userData: {
            name: newlyCreatedUser.name,
            email: newlyCreatedUser.email,
            _id: newlyCreatedUser._id,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const getUser = await User.findOne({ email });

    if (!getUser) {
      return res.status(401).json({
        success: false,
        message: "wrong email",
      });
    }
    const checkAuth = bcrypt.compare(password, getUser.password);

    if (!checkAuth) {
      return res.status(401).json({
        success: false,
        message: "wrrong password",
      });
    }
    const token = generateToken(getUser?._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "user Loogged in",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    withCredentials: true,
    httpOnly: false,
  });

  return res.status(200).json({
    status: true,
    message: "logout successfull",
  });
};

const alertpost = async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.userId;
  const alert = await Alert.create({
    touristId: userId,
    type: "panic",
    time: new Date(),
    location: { lat, lng },
  });
  console.log("Sending alert to police");

  res.json({ success: true, alert });
};

export { RegisterUser, loginUser, logout, alertpost };
