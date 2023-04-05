import jwt from "jsonwebtoken";
import User from "../../../models/User";

const isAdmin = async (req, res, next) => {
  const { cookies } = req;
  const token = cookies.access_token;
  if (!token) {
    res.send({
      message: "Unauthorized ? Please use the valid token",
    });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.role !== "admin") {
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

export default isAdmin;
