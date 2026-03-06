// Utility functions for generating secure random tokens.
// Used for email verification and password reset tokens.

import crypto from "crypto";

/**
 * Generates a cryptographically secure random hex token.
 * @param {number} bytes - Number of random bytes (default 32 = 64 char hex string)
 * @returns {object} { token, hashed }
 *   token  — plain text, sent in the email link
 *   hashed — SHA-256 hash, stored in the database
 */
export const generateSecureToken = (bytes = 32) => {
  const token = crypto.randomBytes(bytes).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
};

/**
 * Hashes a plain text token for comparison against the stored hash.
 * @param {string} token - Plain text token from the URL
 * @returns {string} SHA-256 hash
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};