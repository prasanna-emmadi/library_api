import jwt from "jsonwebtoken";

export const jwtVerify = (req, res, next) => {
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
};
