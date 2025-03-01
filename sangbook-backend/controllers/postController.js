import { getAllPosts, createPost } from "../models/postModel.js";

// Lấy tất cả bài viết
export const getPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xử lý đăng bài mới
export const createNewPost = async (req, res) => {
  const { content } = req.body;
  const image = req.file ? req.file : null; // Chắc chắn chỉ lấy một ảnh với req.file

  try {
    const newPost = await createPost(content, image);

    res.status(201).json({
      message: "Bài viết đã được đăng thành công!",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi đăng bài viết!" });
  }
};
