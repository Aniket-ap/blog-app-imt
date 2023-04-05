import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Blog from "../../../models/Blog";

const isAuthor = async (req, res, next) => {
  const { cookies } = req;
  const token = cookies.access_token;
  if (!token) {
    res.send({
      message: "Unauthorized ? Please use the valid token",
    });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { blogId } = req.query;
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.author.toString() !== decodedToken._id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (error) {
      res.send({
        message: "Unauthorized ? Please use the valid token",
      });
    }
  }
  next();
};

export default isAuthor;
