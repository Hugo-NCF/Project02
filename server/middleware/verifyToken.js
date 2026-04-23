const admin = require("../config/firebase");
const User = require("../models/User");

// Falls back to mock base64 decode when Firebase env vars are not configured.
const USE_MOCK = !process.env.FIREBASE_PROJECT_ID;

async function verifyToken(req, res, next) {
  const header = req.headers.authorization ?? "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  const token = header.slice(7);

  try {
    if (USE_MOCK) {
      const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
      if (!payload.uid || !payload.role) {
        return res.status(401).json({ error: "Invalid token payload" });
      }
      req.user = payload;
      return next();
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const isAdminEmail = process.env.ADMIN_EMAIL && decoded.email === process.env.ADMIN_EMAIL;
    let user = await User.findOne({ email: decoded.email }).lean();
    if (!user) {
      user = await User.create({
        name: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        role: isAdminEmail ? "admin" : "seeker",
      });
    } else if (isAdminEmail && user.role !== "admin") {
      user = await User.findOneAndUpdate(
        { email: decoded.email },
        { role: "admin" },
        { new: true }
      ).lean();
    }
    req.user = { uid: decoded.uid, email: decoded.email, name: user.name, role: user.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
