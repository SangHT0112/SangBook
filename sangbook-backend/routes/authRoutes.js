import express from "express";
import { register, login, getUser, logout } from "../controllers/authController.js";

const router = express.Router();
import upload from "../middleware/upload.js";

router.post("/register", upload.single("avatar"), register);

router.post('/login', login);
router.get('/user', getUser);
router.post('/logout', logout);

// API upload avatar

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không có file nào được tải lên!' });
    }

    // Trả về URL của file vừa upload
    const fileUrl = `http://localhost:4000/uploads/avatars/${req.file.filename}`;
    res.json({ fileUrl });
});
export default router;
