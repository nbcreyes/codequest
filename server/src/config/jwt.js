// JWT signing and verification helpers.
// Two token types are used:
//   parent token  — issued on login, authorizes parent dashboard actions
//   child token   — issued on child switch, scopes the kid experience to one child

import jwt from "jsonwebtoken";

/**
 * Signs a parent JWT.
 * @param {string} parentId
 * @returns {string}
 */
export const signParentToken = (parentId) => {
  return jwt.sign(
    { id: parentId, role: "parent" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Signs a child session JWT.
 * Carries both parentId and childId so ownership is always verifiable.
 * @param {string} parentId
 * @param {string} childId
 * @returns {string}
 */
export const signChildToken = (parentId, childId) => {
  return jwt.sign(
    { id: parentId, childId, role: "child" },
    process.env.JWT_SECRET,
    { expiresIn: "12h" } // Child sessions expire after 12 hours
  );
};

/**
 * Verifies any JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Keep signToken as an alias for signParentToken so existing
// auth controller code does not need to change
export const signToken = signParentToken;