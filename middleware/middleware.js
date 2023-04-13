import jwt from "jsonwebtoken";

export const jwtVerify = (req, res, next) => {
  console.log("jwtVerify");
  const auth = req.get("authorization");

  //const auth = authObj;
  console.log({ auth });
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log({ decodedToken });
    if (!token || !decodedToken.username) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    req.user = decodedToken; // { username: username}
    console.log({ requser: req.user, decodedToken });
    next();
  } else {
    return res.status(401).json({ error: "token missing or invalid" });
  }
};
