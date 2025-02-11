"use server";

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function generateJwt(data, expiresIn = "5m") {
  const token = jwt.sign(data, SECRET, { expiresIn: expiresIn });
  return token;
}

export async function decodeJwtToken(token) {
  try {
    return jwt.decode(token, SECRET);
  } catch (error) {
    return null;
  }
}

export async function verifyJwtToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
