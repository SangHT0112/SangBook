import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import db from "../db.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.file ? `uploads/avatars/${req.file.filename}` : null;

    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)", 
    [username, email, hashedPassword, avatar]);



    res.status(201).json({ success: true, message: "Đăng ký thành công!", avatar });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra người dùng có tồn tại không
    const [users] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: "Email hoặc mật khẩu không đúng!" });
    }

    const user = users[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Email hoặc mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar ? `http://localhost:4000/${user.avatar}` : null,
      },
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

export const getUser = (req, res) => { 
    try {
        const token = req.cookies.auth_token;
        if (!token) return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });

        const decoded = jwt.verify(token, "SECRET_KEY");

        const query = "SELECT id, email FROM users WHERE id = ?";
        db.query(query, [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Lỗi server!" });
            if (results.length === 0) return res.status(404).json({ success: false, message: "User không tồn tại!" });

            res.json({ success: true, user: results[0] });
        });
    } catch (err) {
        res.status(401).json({ success: false, message: "Token không hợp lệ!" });
    }
};

export const logout = (req, res) => { 
    res.clearCookie("auth_token");
    res.json({ success: true, message: "Đã đăng xuất!" });
};
