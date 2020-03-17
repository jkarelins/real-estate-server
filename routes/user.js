const { Router } = require("express");
const router = new Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const { toJWT } = require("../helpers/jwt");

// TRY TO LOGIN USER
router.post("/login", (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Please supply a valid username and password"
    });
  }
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Please supply a valid email and password"
    });
  }
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(400).send({
          message:
            "User with provided email does not exist. Please register first."
        });
      } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        return res.send({
          jwt: toJWT({ userId: foundUser.id }),
          email: foundUser.email,
          id: foundUser.id
        });
      } else {
        res.status(400).send({
          message:
            "Password and Username does not match. Check your credentials, and try one more time."
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong. Try one more time later."
      });
    });
});

// CREATE NEW USER
router.post("/create", (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Please supply a valid username and password"
    });
  }

  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.role ||
    !req.body.email
  ) {
    return res.status(400).send({
      message: "Please supply a valid userinformation"
    });
  }

  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role || "buyer",
    email: req.body.email,
    phoneNumber: req.body.phoneNumber || 0,
    isAdmin: false
  };
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(foundUser => {
    if (foundUser) {
      return res.status(400).send({
        message: "Please choose another username. This username already exists."
      });
    }
    User.create(user)
      .then(newUser => {
        res.send({
          jwt: toJWT({ userId: newUser.id }),
          username: newUser.username,
          id: newUser.id
        });
      })
      .catch(next);
  });
});

// GET ONE USER FROM DB
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  User.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: `Sorry user with id: ${id} not found`
        });
      }
      user.password = "";
      return res.json(user);
    })
    .catch(next);
});

// GET ALL USERS FROM DB
router.get("/", (req, res, next) => {
  User.findAll()
    .then(users => {
      if (!users) {
        return res.status(404).send({
          message: "Sorry no Users found"
        });
      }
      users.map(user => (user.password = ""));
      return res.json(users);
    })
    .catch(next);
});

module.exports = router;
