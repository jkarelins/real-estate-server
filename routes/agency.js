const { Router } = require("express");
const router = new Router();

const User = require("../models/user");
const Agency = require("../models/agency");

router.get("/", (req, res, next) => {
  Agency.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "isAdmin", "isActive"]
        }
      }
    ]
  })
    .then(agencies => {
      if (!agencies) {
        return res.status(400).send({
          message: "Agencies not found"
        });
      }
      return res.json(agencies);
    })
    .catch(next);
});

module.exports = router;
