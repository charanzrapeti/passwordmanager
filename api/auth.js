const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("could not find the user");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    if ((error.name = "TypeError")) {
      console.log(error);
      res.redirect("/");
    } else {
      res.status(404).send("Please Authenticate");
    }
  }
};

const dashauth = (req, res, next) => {
  try {
    const authToken = req.cookies["AuthToken"];

    if (!authToken) {
      throw new Error("auth token error");
    }
    next();
  } catch (error) {
    res.redirect("/login");
  }
};
module.exports = { auth, dashauth };
