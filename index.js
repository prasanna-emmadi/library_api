import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoose } from "./models/dbConnect.js";
import BookRouter from "./routes/bookRouter.js";
import UserRouter from "./routes/userRouter.js";

dotenv.config();
const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// GET /books?author=<author_name>
app.use("/ ", UserRouter);
app.use("/books", BookRouter);

app.listen(port, async () => {
  console.log(`listening to port ${port}`);
  await connectMongoose();
  console.log("db connected");
});
