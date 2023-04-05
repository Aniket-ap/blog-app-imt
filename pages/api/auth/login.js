/* eslint-disable import/no-anonymous-default-export */
import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";

import { comparePassword } from "@/utils/auth";
import User from "../../../models/User";

dbConnect();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(401).json({ error: "Email is required" });
      }
      if (!password || password.length < 6) {
        return res.status(401).json({
          error: "Password must be at least 6 chanracters long",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        return res.status(401).json({ error: "Wrong password" });
      }
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
