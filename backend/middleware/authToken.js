import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    // .select("-password") — never attach the password hash to req.user.
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authToken;
