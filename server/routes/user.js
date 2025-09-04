import express from "express";
import { loginUser, logout, RegisterUser, alertpost } from "../controller/user.logic.js";
import userAuthVerification from "../middleware/index.js";

const route = express.Router();

route.post("/register", RegisterUser);
route.post("/login", loginUser);
route.post("/logout", logout);
route.get("/me", userAuthVerification, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});
route.post("/alerts/panic", userAuthVerification, alertpost);

export default route;
