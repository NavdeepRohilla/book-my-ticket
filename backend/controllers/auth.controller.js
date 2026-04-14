import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/User.js";

dotenv.config();

const buildAuthPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const buildToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = buildToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: buildAuthPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = buildToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: buildAuthPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};
