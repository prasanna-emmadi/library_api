import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
const saltRounds = 10;

export const login = async (req, res) => {
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
};

export const register = async (req, res) => {
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
};

export const refresh = async (req, res) => {
  const token = jwt.sign(
    { username: req.user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ token });
};
