import mongoose from "mongoose";
const BookSchema = new mongoose.Schema({
  author: String,
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  title: String,
  year: Number,
  userId: String,
});
//              first string is Name of the collection in database
const BookModel = mongoose.model("books", BookSchema);
export default BookModel;
