function errorHandler(err, _req, res, _next) {
  console.error("API error:", err.message);

  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation failed", details });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ error: `Duplicate ${field}` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
}

module.exports = errorHandler;
