/* eslint-disable import/no-anonymous-default-export */
import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";
import { hashPassword } from "../../../utils/auth";
import User from "../../../models/User";

dbConnect();

export default async (req, res) => {
  if (req.method === "POST") {
      console.log(req)
      const { name, email, password, role } = req.body;
    try {
      if (!name.trim()) {
        return res.status(401).json({ error: "Name is required" });
      }
      if (!email) {
        return res.status(401).json({ error: "Email is required" });
      }
      if (!password || password.length < 6) {
        return res.status(401).json({
          error: "Password must be at least 6 chanracters long",
        });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(401).json({ error: "Email is taken" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await new User({
        name,
        email,
        password: hashedPassword,
        role,
      }).save();
      // signed jwt
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request method" });
  }
};
