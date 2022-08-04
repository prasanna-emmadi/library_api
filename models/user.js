import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
//              first string is Name of the collection in database
const UserModel = mongoose.model("users", userSchema);
export default UserModel;
