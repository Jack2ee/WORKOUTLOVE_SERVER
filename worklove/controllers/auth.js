const User = require("../models/user");

exports.login = (req, res, next) => {
  const email = "test@test.com";
  const password = "123123";
  const name = "test1";
  const oauth = true;
  const oauth_provider = "google";
  const sex = true;
  const age = 27;
  const height = 170;
  const weight = 70;
  const user = new User({
    email: email,
    password: password,
    name: name,
    oauth: oauth,
    oauth_provider: oauth_provider,
    sex: sex,
    age: age,
    height: height,
    weight: weight
  });
  return user.save();
};
