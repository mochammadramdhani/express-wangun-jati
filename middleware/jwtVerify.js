import jwt from "jsonwebtoken";
import { CONFIG } from "../config/main.config.js";

const JWT_SECRET = CONFIG.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = req.cookies.WJKTOKEN_COOKIE;

  if (!token) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
}

export { verifyToken };
