// lib/auth.js
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = "saas_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function setTokenCookie(res, token) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie(res) {
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function getTokenFromReq(req) {
  if (!req.headers.cookie) return null;
  const cookies = parse(req.headers.cookie);
  return cookies[TOKEN_NAME];
}

export function getUserFromReq(req) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  return verifyToken(token);
}

// Middleware-style helper for protected API routes
export function requireAuth(handler, requiredRole = null) {
  return async (req, res) => {
    const user = getUserFromReq(req);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Please log in" });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
    }

    req.user = user;
    return handler(req, res);
  };
}