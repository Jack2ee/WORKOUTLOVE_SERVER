const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "Workoutlove";

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 401;
    throw error;
  }
  const authToken = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(authToken, JWT_SECRET_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
