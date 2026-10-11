import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashPassword });
    const savedUser = await newUser.save();

    // Never send the password hash back to the client.
    const { password: _omit, ...safeUser } = savedUser.toObject();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const logout = (_req, res) => {
  // Token is stored client-side (localStorage) and sent as a Bearer header,
  // so there's no server-side session/cookie to clear. The client is
  // responsible for discarding the token.
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};
