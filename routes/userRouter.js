import express from "express";

import { login, register, refresh } from "../controllers/userController.js";
import { jwtVerify } from "../middleware/middleware.js";

const router = express.Router();

// middleware for /books
// { "authorization" : "Bearer token"}

router.post("/login", login);
router.post("/register", register);
router.use("/refresh", jwtVerify);
router.get("/refresh", refresh);

export default router;
