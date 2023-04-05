import nc from "next-connect";
import dbConnect from "../../../db/dbConnect";
import Blog from "../../../models/Blog";
import auth from "../middleware/auth";

dbConnect();

const handler = nc()
  .use(auth)
  .post(async (req, res) => {
    try {
      const { title, content } = req.body;
      const blog = new Blog({ title, content, author: req.user._id });
      await blog.save();
      return res.status(201).json({ success: true, data: blog });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

export default handler;
