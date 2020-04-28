const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");

const JWT_SECRET_KEY = "Workoutlove";

exports.oauth = async (req, res, next) => {
  const oauth = req.body.oauth;
  const oauthProvider = req.body.oauthProvider;
  const name = req.body.name;
  const profileImageUrl = req.body.profileImageUrl;
  const thirdPartyId = req.body.thirdPartyId;
  const accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  let loadedUser;
  try {
    loadedUser = await User.findOne({
      oauth: oauth,
      oauthProvider: oauthProvider,
      name: name,
      thirdPartyId: thirdPartyId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

  let updatedUser;
  if (loadedUser) {
    try {
      const authToken = await jwt.sign(
        {
          oauth: oauth,
          oauthProvider: oauthProvider,
          userId: loadedUser._id,
          name: name,
          profileImageUrl: loadedUser.profileImageUrl,
        },
        JWT_SECRET_KEY
        // { expiresIn: "24h" }
      );
      loadedUser.authToken = authToken;
      updatedUser = await loadedUser.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "기존 유저의 토큰 값을 업데이트할 수 없습니다.";
      }
      next(err);
    }
  }
  if (updatedUser) {
    res.status(200).json({
      message: "기존 유저의 토큰 값을 업데이트하였습니다.",
      authToken: updatedUser.authToken,
    });
  }

  let newUser;
  if (!loadedUser) {
    try {
      const newUserId = mongoose.Types.ObjectId();
      const authToken = await jwt.sign(
        {
          oauth: oauth,
          oauthProvider: oauthProvider,
          userId: newUserId,
          name: name,
          profileImageUrl: profileImageUrl,
        },
        JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
      newUser = await new User({
        _id: newUserId,
        name: name,
        profileImageUrl: profileImageUrl,
        oauth: oauth,
        oauthProvider: oauthProvider,
        thirdPartyId: thirdPartyId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        authToken: authToken,
      }).save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저를 생성할 수 없습니다.";
      }
      next(err);
    }
  }

  if (newUser) {
    res.status(201).json({
      message: "새로운 유저 생성을 완료하였습니다",
      authToken: newUser.authToken,
    });
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.userId;

  let loadedUser;
  try {
    loadedUser = await User.findOne({ _id: userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾을 수 없습니다.";
    }
    next(err);
  }

  if (loadedUser) {
    res.status(200).json({
      message: "유저 정보를 성공적으로 로드하였습니다.",
      user: loadedUser,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const updatedContents = req.body.contents;

  let updatedUser;
  try {
    const userId = req.userId;
    const user = await User.findOneAndUpdate({ _id: userId }, updatedContents, {
      new: true,
      useFindAndModify: true,
    });
    updatedUser = await user.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
      err.message = "유저 정보를 업데이트할 수 없습니다.";
    }
    next(err);
  }

  if (updatedUser) {
    res.status(200).json({
      message: "회원정보 수정을 완료하였습니다.",
      user: updatedUser,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  let deleteUser;
  try {
    const userId = req.userId;
    deleteUser = await User.findOneAndRemove({ _id: userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾을 수 없습니다.";
    }
    next(err);
  }

  if (deleteUser) {
    res.status(200).json({
      message: "회원 탈퇴를 완료했습니다.",
      authToken: null,
    });
  }
};
