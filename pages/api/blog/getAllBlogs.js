import nc from "next-connect";
import dbConnect from "../../../db/dbConnect";
import Blog from "../../../models/Blog";

dbConnect();

const handler = nc().get(async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default handler;
