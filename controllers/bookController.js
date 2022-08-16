import BookModel from "../models/book.js";
import UserModel from "./models/user.js";

export const getBooks = async (req, res) => {
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
};

export const editBook = async (req, res) => {
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
};

export const createBook = async (req, res) => {
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
};

export const deleteBook = async (req, res) => {
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
};
