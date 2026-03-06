// JWT signing and verification helpers.
// Centralizing these here means the algorithm and options
// are never duplicated across controllers.

import jwt from "jsonwebtoken";

/**
 * Signs a JWT for the given parent ID.
 * @param {string} parentId - The MongoDB _id of the parent
 * @returns {string} Signed JWT string
 */
export const signToken = (parentId) => {
  return jwt.sign(
    { id: parentId, role: "parent" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};