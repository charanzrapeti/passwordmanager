const { Router } = require("express");
const Pass = require("../models/passentry");
const User = require("../models/user.js");
const auth = require("./auth.js");
router = Router();

router.get("/user/me", auth.auth, (req, res) => {
  res.json(req.user);
});
router.get("/pass", auth.auth, async (req, res) => {
  try {
    const entries = await Pass.find({ owner: req.user._id });
    res.json(entries);
  } catch (error) {
    res.status(500);
    next(error);
  }
});
router.get("/pass/:id", auth.auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const pass = await Pass.findOne({ _id, owner: req.user._id });

    if (!pass) {
      res.status(404).send();
    }
    res.json(pass);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/pass", auth.auth, async (req, res, next) => {
  try {
    // const Data = new Pass(req.body);
    const Data = new Pass({
      ...req.body,
      owner: req.user._id,
    });
    const createdData = await Data.save();
    res.json(createdData);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }
    res.status(500);
    next(error);
  }
});

const authTokens = {};
router.post("/user", async (req, res, next) => {
  try {
    if (req.body.password !== req.body.confirmpassword) {
      const error = new Error("password and confirm password didn't match");
      return next(error);
    }
    const user = new User(req.body);
    const token = await user.GenerateAuthToken();

    const createdData = await user.save();
    authTokens[token] = createdData;
    res.cookie("AuthToken", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: false,
    });
    // res.redirect("/dashboard");
    res.status(200).json({ createdData, token });
  } catch (error) {
    res.status(400);
    next(error);
  }
});
router.post("/user/login", async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.GenerateAuthToken();
    authTokens[token] = user;
    res.cookie("AuthToken", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: false,
    });
    res.status(200).send({ user, token });
    // res.status(200).redirect("/dashboard");
  } catch (error) {
    console.log("reached here");
    res.status(404);
    next(error);
  }
});
router.post("/user/logout", auth.auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("AuthToken");
    res.send("user loggedout ");
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/pass/:id", auth.auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "password",
    "username",
    "description",
    "title",
    "url",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    const error = new Error("invaid update");
    res.status(400);
    return next(error);
  }
  try {
    const pass = await Pass.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!pass) {
      const seconderror = new Error("could not find the pass");
      res.status(400);
      return next(seconderror);
    }
    updates.forEach((update) => {
      pass[update] = req.body[update];
    });
    await pass.save();
    // const pass = await Pass.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.status(200).send(pass);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.patch("/user/me", auth.auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    const error = new Error("invaid update");
    res.status(400);
    return next(error);
  }
  try {
    // const user = await User.findById(req.params.id);
    const user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!user) {
      const seconderror = new Error("could not find the task");
      res.status(400);
      return next(seconderror);
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
});
router.delete("/task/:id", auth.auth, async (req, res) => {
  try {
    const pass = await Pass.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!pass) {
      res.status(404).send();
    }
    res.send(pass);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.delete("/user/delete", auth.auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
