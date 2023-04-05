import nc from "next-connect";
import cookie from "cookie";
import auth from "../middleware/auth";

const handler = nc()
  .use(auth)
  .get(async (req, res) => {
    try {
      const saveCookie = cookie.serialize("access_token", null, {
        httpOnly: true,
        secure: "development",
        maxAge: -1, // 30 days
        path: "/",
      });
      res.setHeader("Set-Cookie", saveCookie);
      res.send({ message: "Logout successfully" });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

export default handler;
