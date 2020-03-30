const User = require("../models/user");
const Agency = require("../models/agency");
const { toData } = require("../helpers/jwt");

function auth(req, res, next) {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      User.findByPk(data.userId, { include: [Agency] })
        .then(user => {
          if (!user) return next("User does not exist");
          req.user = user;
          next();
        })
        .catch(next);
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    console.log(auth);
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
}

module.exports = auth;
