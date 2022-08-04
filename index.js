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

app.use("/books", (req, res, next) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!token || !decodedToken.username) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    req.user = decodedToken;
    next();
  } else {
    return res.status(401).json({ error: "token missing or invalid" });
  }
});

// GET /books?author=<author_name>
app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
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

app.get("/books", async (req, res) => {
  // get username from token
  console.log(req.user.username);
  const username = req.user.username;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const allBooks = await BookModel.find({ userId: user._id });
      res.json(allBooks);
    } else {
      res.status(404).json({ message: "db connection issue" });
    }
  } catch (e) {
    res.status(404).json({ message: "db connection issue" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  } catch (e) {
    res.status(404).json({ message: "db connection issue" });
  }
});

app.put("/books", async (req, res) => {
  try {
    const updatedBook = await BookModel.findOneAndUpdate(
      { title: req.body.title },
      req.body
    );
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "db connection issue" });
    }
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
      console.log({ bookDetails });
      const newBook = new BookModel(bookDetails);
      const savedBook = await newBook.save();
      console.log("new book saved");
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
