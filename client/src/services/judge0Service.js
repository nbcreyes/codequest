// Judge0 code execution service.
// Judge0 is a remote code execution API — it receives Python code,
// runs it in a sandbox, and returns stdout/stderr.
// Full Judge0 integration with the real API key is wired in Step 12.
// This stub calls our own backend which proxies to Judge0.

import childApi from "./childApi";

/**
 * Submits Python code for execution.
 * @param {string} code - The Python code to execute
 * @returns {object} { output, error, isError, executionTime }
 */
export const executeCode = async (code) => {
  const response = await childApi.post("/execute", { code, language: "python" });
  return response.data;
};