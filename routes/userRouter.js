import express from "express";

import { login, register, refresh } from "../controllers/userController";

const router = express.Router();

// middleware for /books
// { "authorization" : "Bearer token"}

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", refresh);

export default router;
