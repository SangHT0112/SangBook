import db from "../db.js"; // Kết nối với MySQL

// Lấy tất cả bài viết
export const getAllPosts = async () => {
  const [rows] = await db.query(`
    SELECT 
      Posts.*, 
      Users.username, 
      Users.avatar, 
      (SELECT COUNT(*) FROM post_reactions WHERE post_reactions.post_id = Posts.id) AS like_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_comments.post_id = Posts.id) AS comment_count
    FROM Posts
    JOIN Users ON Posts.user_id = Users.id
    ORDER BY Posts.id DESC
  `);
  return rows;
};

// Tạo bài viết mới
export const createPost = async (content, image) => {
  const imagePath = image ? `/uploads/posts/${image.filename}` : null; // Đảm bảo lưu đúng đường dẫn ảnh

  // Truy vấn vào database để thêm bài viết mới
  const [result] = await db.query(`
    INSERT INTO Posts (content, image) 
    VALUES (?, ?)
  `, [content, imagePath]);

  return {
    id: result.insertId,
    content,
    image: imagePath,
  };
};
