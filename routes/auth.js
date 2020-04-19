const express = require("express");

const authController = require("../controllers/auth");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// POST /auth/oauth, BODY: {oauth, oauthProvider, name, profileImageUrl, thirdPartyId, accessToken, refreshToken}
router.post("/oauth", authController.oauth);

// GET /auth/my, HEADERS: `bearer $[authToken]`(AUTHORIZATION)
router.get("/my", isAuth, authController.getUser);

// PUT /auth, HEADERS: `bearer $[authToken]`(AUTHORIZATION), BODY: contents
router.put("/", isAuth, authController.updateUser);

// DELETE /auth, HEADERS: `bearer $[authToken]`(AUTHORIZATION)
router.delete("/", isAuth, authController.deleteUser);

module.exports = router;
