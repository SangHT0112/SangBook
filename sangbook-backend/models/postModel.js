import db from "../db.js";

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
