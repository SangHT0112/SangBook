import express from "express";
import multer from "multer";
import path from "path";
import { getPosts, createNewPost } from "../controllers/postController.js"; // Chắc chắn dùng createNewPost

// Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/posts"); // Đường dẫn lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file với thời gian hiện tại
  },
});

const upload = multer({ storage });

const router = express.Router();

// Route để lấy danh sách bài viết
router.get("/", getPosts);

// Route để đăng bài mới
router.post("/", upload.single("image"), createNewPost); // Chuyển từ createPost thành createNewPost

export default router;
