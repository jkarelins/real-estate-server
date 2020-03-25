const { Router } = require("express");
const router = new Router();

const User = require("../models/user");
const Agency = require("../models/agency");
const AdvertUserLikes = require("../models/aduserlikes");

const bcrypt = require("bcrypt");
const { toJWT } = require("../helpers/jwt");
const auth = require("../middleware/auth");
const AGENCY_AGENT = "agencyAgent";
const AGENCY_MANAGER = "agencyManager";
const PRIVATE_PERSON = "privatePerson";

// TRY TO LOGIN USER - GET AGENCY & LIKES
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
    },
    include: [{ model: Agency }, { model: AdvertUserLikes }]
  })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(400).send({
          message:
            "User with provided email does not exist. Please register first."
        });
      }
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        if (foundUser.isBlockedByAdmin) {
          return res.status(400).send({
            message:
              "Your account was suspended by site administration. Please contact our team ASAP."
          });
        }

        //if everything is good, user can log in:
        foundUser.password = "";
        return res.send({
          jwt: toJWT({ userId: foundUser.id }),
          user: foundUser
        });
      }
      return res.status(400).send({
        message:
          "Password and Username does not match. Check your credentials, and try one more time."
      });
    })
    .catch(err => {
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

  // check everything is in BODY
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

  // check if company is DB
  if (req.body.role !== PRIVATE_PERSON && !req.body.companyName) {
    return res.status(400).send({
      message: "Agency name is not found."
    });
  }

  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber || 0,
    isAdmin: false
  };

  if (user.role === AGENCY_AGENT) {
    Agency.findOne({ where: { name: req.body.companyName } })
      .then(agency => {
        if (!agency) {
          return res
            .status(400)
            .send({
              message: "Sorry, your agency is not found. Contact your manager."
            })
            .end();
        } else {
          user.agencyId = agency.id;
          return findAndCreateUser(req, res, next, user);
        }
      })
      .catch(next);
  } else if (user.role === AGENCY_MANAGER) {
    Agency.findOne({ where: { name: req.body.companyName } }).then(agency => {
      if (agency) {
        return res.status(400).send({
          message:
            "Sorry, we have agency with this name in our DB. Please contact your manager."
        });
      } else {
        Agency.create({ name: req.body.companyName })
          .then(newAgency => {
            user.agencyId = newAgency.id;
            return findAndCreateUser(req, res, next, user);
          })
          .catch(next);
      }
    });
  } else {
    return findAndCreateUser(req, res, next, user);
  }
});

// ADD EXTRA PAID ADVERTISEMENTS
router.post("/addcredits", auth, (req, res, next) => {
  console.log(req.user.role);

  if (req.body.paymentIntent.status === "succeeded") {
    switch (req.user.role) {
      case PRIVATE_PERSON:
        {
          User.findByPk(req.user.id)
            .then(foundUser => {
              foundUser.paidAdvertLimit =
                +foundUser.paidAdvertLimit +
                Math.round(+req.body.paymentIntent.amount / 100);
              foundUser
                .save()
                .then(user => {
                  res.send(user);
                })
                .catch(next);
            })
            .catch(next);
        }
        break;
      case AGENCY_MANAGER || AGENCY_AGENT:
        {
          Agency.findByPk(req.user.agencyId).then(agency => {
            agency.advertBalance =
              +agency.advertBalance +
              Math.round(+req.body.paymentIntent.amount / 100);
            agency
              .save()
              .then(agency => {
                res.send(agency);
              })
              .catch(next);
          });
        }
        break;
    }
  } else {
    return res.status(400).send({
      message: `Sorry payment was not successful`
    });
  }
});

// GET ONE USER FROM DB
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  User.findByPk(id, { include: [Agency] })
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

function findAndCreateUser(req, res, next, user) {
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

    if (user.role === PRIVATE_PERSON) {
      user.freeAdvertLimit = 1;
    }
    if (user.role === AGENCY_MANAGER) {
      user.freeAdvertLimit = 5;
    }
    User.create(user)
      .then(newUser => {
        return res.send({
          jwt: toJWT({ userId: newUser.id }),
          user: newUser,
          justRegistered: true
        });
      })
      .catch(next);
  });
}

module.exports = router;
