import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const { cookies } = req;
  const token = cookies.access_token;
  if (!token) {
    res.send({
      message: "Unauthorized ? Please use the valid token",
    });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
    } catch (error) {
      res.send({
        message: "Unauthorized ? Please use the valid token",
      });
    }
  }
  next();
};

export default auth;
