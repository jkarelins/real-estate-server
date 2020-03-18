const { Router } = require("express");
const router = new Router();

const User = require("../models/user");
const Advert = require("../models/advert");

const auth = require("../middleware/auth");

// GET ALL ADVERTISEMENTS USING LIMIT
router.get("/all", (req, res, next) => {
  const limit = 25;
  const offset = req.query.offset || 0;
  Advert.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "isAdmin", "isActive"]
        }
      }
    ]
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

// FIND ONE ADVERTISEMENT
router.get("/:advertId", (req, res, next) => {
  const advertId = req.params.advertId;
  Advert.findByPk(advertId, {
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "isAdmin", "isActive"]
        }
      }
    ]
  })
    .then(advert => {
      if (!advert) {
        return res.status(404).send({
          message: `Sorry advert with ${advertId} not found`
        });
      }
      res.json(advert);
    })
    .catch(next);
});

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
  const userId = req.user.id;
  Advert.create({
    ...req.body,
    userId
  })
    .then(newAdvert => {
      res.json(newAdvert);
    })
    .catch(next);
});

module.exports = router;
