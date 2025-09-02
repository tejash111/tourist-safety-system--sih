import express from "express";
import { loginUser, logout, RegisterUser } from "../controller/user.logic.js";
import userAuthVerification from "../middleware/index.js";

const route = express.Router();

route.post("/register", RegisterUser);
route.post("/login", loginUser);
route.post("/logout", logout);
route.post("/auth", userAuthVerification);

export default route;
