const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signupWithEmail = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    try {
      const error = new Error("Validation Failed");
      error.statusCode = 422;
      error.data = validationErrors.array();
      throw error;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return next(error);
    }
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      if (existingUser.oauth) {
        return res.status(303).json({
          message: `${existingUser.oauth_provider} 계정으로 가입한 이력이 있습니다.`,
          oauth: existingUser.oauth,
          oauthProvider: existingUser.oauth_provider,
        });
      }
      return res.status(303).json({
        message: "해당 매일은 가입된 이력이 있습니다.",
        oauth: existingUser.oauth,
        oauthProvider: existingUser.oauth_provider,
      });
    }
    const saltRound = 12;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const user = await new User({
      email: email,
      password: hashedPassword,
      name: name,
    }).save();
    return res
      .status(200)
      .json({ message: "축하합니다. 회원가입 되었습니다.", userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.signupWithOauth = async (req, res, next) => {};

exports.loginWithEmail = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error = new Error("가입하지 않은 메일입니다.");
      error.statusCode = 401;
      throw error;
    } else {
      if (loadedUser.oauth) {
        return res.status(303).json({
          message: `${loadedUser.oauth_provider} 계정으로 가입한 이력이 있습니다.`,
          oauth: loadedUser.oauth,
          oauthProvider: loadedUser.oauth_provider,
        });
      }
    }

    const rightPassword = await bcrypt.compare(password, loadedUser.password);
    if (!rightPassword) {
      const error = new Error("잘못된 비밀번호입니다.");
      error.statusCode = 401;
      throw error;
    }
    const auth_token = jwt.sign(
      {
        email: loadedUser.email,
        oauth: loadedUser.oauth,
        oauthProvider: loadedUser.oauth_provider,
        userId: loadedUser._id,
        name: loadedUser.name,
      },
      "Workoutlove",
      { expiresIn: "24h" }
    );
    await User.updateOne(
      { email: email },
      {
        auth_token: auth_token,
      }
    );
    return res.status(200).json({ authToken: auth_token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 400;
    }
    return next(err);
  }
};

exports.loginWithOauth = (req, res, next) => {};
