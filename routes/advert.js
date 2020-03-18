const { Router } = require("express");
const router = new Router();

const User = require("../models/user");
const Advert = require("../models/advert");

const auth = require("../middleware/auth");

// POST NEW ADVERTISEMENT
router.post("/", auth, (req, res, next) => {
  if (!req.body) {
    return es.status(400).send({
      message: "Please supply a valid advertisement information"
    });
  }
  if (!req.body.description || !req.body.postcode) {
    return es.status(400).send({
      message: "Please fill in required fields"
    });
  }
  Advert.create({ ...req.body, userId: req.user.id })
    .then(newAdvert => {
      res.json(newAdvert);
    })
    .catch(next);
});

// GET ALL ADVERTISEMENTS USING LIMIT
router.get("/all", (req, res, next) => {
  const limit = 25;
  const offset = req.query.offset || 0;
  Advert.findAndCountAll({
    limit,
    offset
  })
    .then(adverts => {
      if (!adverts.rows) {
        return res.status(404).send({
          message: "Sorry no adverts found"
        });
      }
      const { rows, count } = adverts;
      res.json({ data: rows, count: count });
    })
    .catch(next);
});

module.exports = router;
