const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middleware = require("./middleware");
const mongoose = require("mongoose");
require("dotenv").config();
const logs = require("./api/logs");
const auth = require("./api/auth.js");
const exphbs = require("express-handlebars");
const path = require("path");
var cookies = require("cookie-parser");

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`

const app = express();
app.use(cookies());
app.use(morgan("common"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: [
      //  path to your partials
      path.join(__dirname, "views/partials"),
    ],
  })
);
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.get("/", (req, res) => {
  res.render("main");
});
app.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "signup",
  });
});
app.get("/login", (req, res) => {
  res.render("login", {
    layout: "signup",
  });
});
app.get("/dashboard", auth.dashauth, (req, res) => {
  res.render("dashboard", {
    layout: "dashboard",
  });
});
app.get("/dashpost", auth.dashauth, (req, res) => {
  res.render("dashpost", {
    layout: "dash",
    message: "create item",
  });
});
app.get("/dashpatch/:id", (req, res) => {
  res.render("dashpatch", {
    layout: "dash",
    message: "view item",
    id: req.params.id,
  });
});

app.use("/api", logs);
app.use(middleware.NotFound);

app.use(middleware.ErrorHandler);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
