const express = require("express");
const morgan = require("morgan");
const flash = require("connect-flash");
const cookie = require("cookie-parser");
const session = require("express-session");

const mongoose = require("mongoose");
const passport = require("passport");
const app = express();
const path = require("path");

const { url } = require("./config/database");

//database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require("./config/passport")(passport);

//settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middelware
app.use(morgan("dev"));
app.use(cookie());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use("/", require("./app/routes/signin")(app, passport));
app.use("/index", require("./app/routes/index")(app, passport));

//static files
app.use("/public", express.static(path.join(__dirname, "public")));
//listener
app.listen(app.get("port"), () => {
  console.log("Server on port: " + app.get("port"));
});
