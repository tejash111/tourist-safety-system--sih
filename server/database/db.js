import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGO_DB).then(() => console.log("db connected"));
