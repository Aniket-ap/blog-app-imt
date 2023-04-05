import nc from "next-connect";
import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import { comparePassword } from "@/utils/auth";
import User from "../../../models/User";

dbConnect();

const handler = nc().post(async (req, res) => {
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
    const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    const saveCookie = cookie.serialize("access_token", authToken, {
      httpOnly: true,
      secure: "development",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    res.setHeader("Set-Cookie", saveCookie);

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      authToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default handler;
