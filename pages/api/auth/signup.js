import nc from "next-connect";
import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { hashPassword } from "../../../utils/auth";
import User from "../../../models/User";

dbConnect();

const handler = nc().post(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
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
