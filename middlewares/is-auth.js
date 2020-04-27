const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const JWT_SECRET_KEY = "Workoutlove";

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 401;
    throw error;
  }
  const uglifiedToken = authHeader.split(" ")[1];

  let authToken;
  try {
    const AESbytes = await CryptoJS.AES.decrypt(
      uglifiedToken,
      `${JWT_SECRET_KEY}`
    );
    authToken = await AESbytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = "토큰 바이트화에 실패하였습니다.";
    }
  }

  let decodedToken;
  if (authToken) {
    try {
      decodedToken = await jwt.verify(authToken, JWT_SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }
  }

  req.userId = decodedToken.userId;
  next();
};
