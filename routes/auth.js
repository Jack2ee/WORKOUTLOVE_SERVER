const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup/email",
  [
    check("email")
      .isEmail()
      .withMessage("이메일 형식에 맞춰 입력해주세요.")
      .normalizeEmail(),
    check("password").trim().exists(),
    check("passwordConfirmation", "비밀번호와 비밀번호 확인은 일치해야 합니다.")
      .exists()
      .custom((value, { req }) => value === req.body.password),
    check("name").trim().exists(),
  ],
  authController.signupWithEmail
);

router.put("/signup/oauth", authController.signupWithOauth);

router.post("/login/email", authController.loginWithEmail);

router.post("/login/oauth", authController.loginWithOauth);

module.exports = router;
