import express from "express";
import "./database/db.js";
import useroutes from "./routes/user.js";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/user/", useroutes);

app.use("/api", (req, res) => {
  res.status(200).json({
    message: "hello SIH",
  });
});

app.listen(3000, () => {
  console.log("App is now running on port 3000");
});
