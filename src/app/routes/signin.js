module.exports = (app, passport) => {
  const router = require("express").Router();
  router.get("/", (req, res) => {
    res.render("login", {
      message: req.flash("login_message"),
    });
  });

  router.get("/signup", (req, res) => {
    res.render("signup", {
      message: req.flash("signup_message"),
    });
  });

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/index",
      failureRedirect: "/",
      failureFlash: true,
    })
  );

  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/index",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  return router;
};
