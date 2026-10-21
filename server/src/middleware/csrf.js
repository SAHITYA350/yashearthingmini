import { fail } from "../utils/http.js";

export default function csrf(req, _res, next) {
  // Allow read methods, Bearer auth, test environments, or matching CSRF tokens
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    req.headers.authorization ||
    process.env.NODE_ENV !== "production" ||
    (req.cookies?.yash_csrf && req.get("x-csrf-token") === req.cookies.yash_csrf)
  ) {
    return next();
  }
  return next(fail(403, "Invalid CSRF token", "CSRF_INVALID"));
}