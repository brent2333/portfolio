const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, jwtKey || process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

function verifyTokenCookie(req, res, next) {
  const cookie = req.header("Cookie");
  const split = cookie.split(`; jwt=`);
  const token = split[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, jwtKey || process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
  next();
}

module.exports = {
  verifyTokenCookie,
  verifyToken,
};
