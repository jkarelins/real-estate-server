const { Router } = require("express");
const router = new Router();

const User = require("../models/user");
const Advert = require("../models/advert");
const Image = require("../models/image/image");
const AdvertImage = require("../models/image/advert_image");
const Extra = require("../models/extra/extra");
const AdvertExtra = require("../models/extra/advert_extra");
const AdvertUserLikes = require("../models/aduserlikes");
const Appointment = require("../models/appointment/appointment");
const AdvertAppointment = require("../models/appointment/advertappointment");

const auth = require("../middleware/auth");
const { checkForCredits } = require("../middleware/credits");

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
          exclude: ["password", "isAdmin"]
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
          exclude: ["password", "isAdmin"]
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
router.post("/", auth, checkForCredits, (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Please supply a valid advertisement information"
    });
  }
  if (!req.body.description || !req.body.postcode) {
    return res.status(400).send({
      message: "Please fill in required fields"
    });
  } else {
    const userId = req.user.id;
    const { user } = req;
    Advert.create({
      ...req.body,
      userId
    })
      .then(newAdvert => {
        res.json({ newAdvert, user });
      })
      .catch(next);
  }
});

module.exports = router;
