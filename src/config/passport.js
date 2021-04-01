const LocalStrategy = require("passport-local").Strategy;
const User = require("../app/model/user");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  //Sign up
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne(
          {
            "local.email": email,
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(
                null,
                false,
                req.flash("signup_message", "The mail was already used")
              );
            } else {
              var new_user = new User();
              new_user.local.email = email;
              new_user.generateHash(password);
              // new_user.local.password = new_user.generateHash(password);
              new_user.save((err) => {
                if (err) {
                  throw err;
                }
                return done(null, new_user);
              });
            }
          }
        );
      }
    )
  );

  //Login
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne(
          {
            "local.email": email,
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(
                null,
                false,
                req.flash("login_message", "The user doesn't exists")
              );
            }
            if (!user.validatePassword(password)) {
              return done(
                null,
                false,
                req.flash("login_message", "Wrong password")
              );
            }
            return done(null, user);
          }
        );
      }
    )
  );
};
