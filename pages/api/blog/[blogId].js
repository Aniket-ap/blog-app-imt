import nc from "next-connect";
import auth from "../middleware/auth";
import Blog from "../../../models/Blog";

const handler = nc()
  .use(auth)
  .get(async (req, res) => {
    try {
      const id = req.query.blogId;
      const blog = await Blog.findById(id);
      if (!blog) {
        return res
          .status(404)
          .json({ success: false, message: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const id = req.query.blogId;
      const { title, content } = req.body;

      const blog = await Blog.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );

      if (blog) {
        res.status(200).json({ success: true, data: blog });
      } else {
        res.status(404).json({ success: false, error: "Blog not found" });
      }
    } catch (error) {
      res.send({
        success: false,
        message: error.messeage,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = req.query.blogId;

      const blog = await Blog.findByIdAndDelete({ _id: id });
      console.log(blog);
      if (blog) {
        res.status(200).json({ success: true, data: blog });
      } else if (!blog) {
        return res
          .status(404)
          .json({ success: false, error: "Blog not found" });
      }

      // Check if user is admin or author of the blog
      //   if (!isAdmin(req.user) && !isAuthor(req.user, blog)) {
      //     return res.status(401).json({
      //       success: false,
      //       error: "Not authorized to delete this blog",
      //     });
      //   }
    } catch (error) {
      res.send({
        success: false,
        message: error.messeage,
      });
    }
  });
export default handler;
