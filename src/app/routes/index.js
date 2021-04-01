const User = require("../model/user");

const menu = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "List",
    url: "/list",
  },
];

module.exports = (app, passport) => {
  const router = require("express").Router();

  router.get("/", isLogged, (req, res) => {
    var nav_data = {
      title: "Home",
      url: req.url,
      user: req.user,
      menu: menu,
    };
    res.render("index", nav_data);
  });

  router.get("/list", isLogged, (req, res) => {
    var nav_data = {
      title: "List",
      url: req.url,
      user: req.user,
      menu: menu,
    };
    res.render("list", nav_data);
  });

  router.get("/logout", isLogged, (req, res) => {
    req.logout();
    res.redirect("/");
  });

  router.post("/add_item", isLogged, async (req, res) => {
    await User.findByIdAndUpdate(
      {
        _id: req.body.id_user,
      },
      {
        $push: {
          list: {
            description: req.body.description,
          },
        },
      }
    );
    res.redirect("/index/list");
  });

  router.post("/delete_item", isLogged, async (req, res) => {
    await User.findByIdAndUpdate(
      {
        _id: req.body.id_user,
      },
      {
        $pull: {
          list: {
            _id: req.body.id_item,
          },
        },
      }
    );
    res.redirect("/index/list");
  });

  function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  }
  return router;
};
