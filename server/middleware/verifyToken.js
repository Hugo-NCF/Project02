// STUB — Jose: replace this body with Firebase Admin SDK verification.
// Current implementation decodes a base64-encoded JSON user object sent by the
// frontend in dev/mock-auth mode. Shape expected: { uid, email, name, role }
//
// Jose's replacement:
//   const admin = require("firebase-admin");
//   const decoded = await admin.auth().verifyIdToken(token);
//   req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name, role: decoded.role };

async function verifyToken(req, res, next) {
  const header = req.headers.authorization ?? "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  const token = header.slice(7);

  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    if (!payload.uid || !payload.role) {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    req.user = payload; // { uid, email, name, role }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
