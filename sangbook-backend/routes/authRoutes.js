import express from "express";
import { register, login, getUser, logout } from "../controllers/authController.js";

const router = express.Router();
import upload from "../middleware/upload.js";

router.post("/register", upload.single("avatar"), register);

router.post('/login', login);
router.get('/user', getUser);
router.post('/logout', logout);

export default router;
