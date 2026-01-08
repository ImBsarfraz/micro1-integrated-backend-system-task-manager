import { pool } from "../config/db.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length)
    return res.status(401).json({ message: "Invalid credentials" });

  const user = rows[0];

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({
    id: user.id,
    role: user.role
  });

  // SEND TOKEN AS HTTP-ONLY COOKIE
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,       // true in production (HTTPS)
    sameSite: "strict",  // prevents CSRF
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({
    message: "Login successful"
  });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({ message: "Logged out successfully" });
};

