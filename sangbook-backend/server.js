import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import upload from "./middleware/upload.js"; // ✅ Middleware upload ảnh
import { fileURLToPath } from "url";
import path from "path";
import db from "./db.js"; // ✅ Kết nối MySQL

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ Fix lỗi __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Cho phép truy cập file ảnh
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// ✅ Route upload ảnh
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Không có file nào được tải lên!" });
  }
  const fileUrl = `/uploads/avatars/${req.file.filename}`;
  res.json({ success: true, avatar: fileUrl });
});

// ✅ Test kết nối MySQL
db.getConnection()
  .then(() => console.log("✅ Kết nối MySQL thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MySQL:", err));

// ✅ Khởi động server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
