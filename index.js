import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";
import UserModel from "./models/user.js";
import { connectMongoose } from "./models/dbConnect.js";
import jwt from "jsonwebtoken";
import BookModel from "./models/book.js";
dotenv.config();
const port = 3001;
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

// middleware for /books
// { "authorization" : "Bearer token"}
app.use("/books", (req, res, next) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!token || !decodedToken.username) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    req.user = decodedToken; // { username: username}
    next();
  } else {
    return res.status(401).json({ error: "token missing or invalid" });
  }
});

// GET /books?author=<author_name>
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ token });
      } else {
        res.status(401).json("Forbidden user");
      }
    } else {
      res.status(401).json("Forbidden user");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json("server internal issue");
  }
});

app.post("/register", async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    const user = {
      username: req.body.username,
      password: passwordHash,
    };
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "db connection issue" });
  }
});

app.post("/refresh", async (req, res) => {
  try {
    const token = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!token || !decodedToken.username) {
      const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ token });
    } else {
      res.status(401).json("Forbidden user");
    }
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Forbidden user" });
  }
});

app.get("/books", async (req, res) => {
  // get username from token
  const username = req.user.username;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const allBooks = await BookModel.find({ userId: user._id });
      res.json(allBooks);
    } else {
      res.status(404).json({ message: "no user found" });
    }
  } catch (e) {
    res.status(404).json({ message: "db connection issue" });
  }
});

app.put("/books", async (req, res) => {
  try {
    const book = await BookModel.findOneAndUpdate(
      { title: req.body.title },
      req.body
    );

    res.status(200).json({ message: "update succesful" });
  } catch (e) {
    console.log("updateBook: ", e);
    res.status(400).json({ message: "bad request" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const username = req.user.username;
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const bookDetails = {
        ...req.body,
        userId: user._id,
      };
      const newBook = new BookModel(bookDetails);
      const savedBook = await newBook.save();
      res.json(savedBook);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (e) {
    res.status(400).json({ message: "error in data format" });
  }
});

app.delete("/books/:title", async (req, res) => {
  try {
    const deletedBook = await BookModel.findOneAndDelete({
      title: req.params.title,
    });
    if (deletedBook) {
      res.json(deletedBook);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  } catch (e) {
    console.log("deleteBook: ", e);
    res.status(400).json({ message: "bad request" });
  }
});

app.listen(port, async () => {
  console.log(`listening to port ${port}`);
  await connectMongoose();
  console.log("db connected");
});
