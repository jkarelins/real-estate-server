const { Router } = require("express");
const router = new Router();
const { or } = require("sequelize");

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

//GET ALL USER'S || AGENCY'S RELATED ADVERTISEMENTS
router.get("/myadvert", auth, (req, res, next) => {
  const { id, agencyId } = req.user;
  Advert.findAll({
    where: or({ userId: id }, { agencyId: agencyId })
  })
    .then(adverts => {
      res.json(adverts);
    })
    .catch(next);
});

// GET USER FAVORITE ADVERTS IF ACTIVE
router.get("/favorites", auth, (req, res, next) => {
  const userId = req.user.id;
  AdvertUserLikes.findAll({
    include: [
      {
        model: Advert,
        where: {
          advertStatus: "published"
        }
      }
    ],
    where: {
      userId: userId
    }
  })
    .then(favorites => {
      res.json(favorites);
    })
    .catch(next);
});

// LIKE ONE ADVERT
router.get("/:advertId/like", auth, (req, res, next) => {
  const advertId = req.params.advertId;
  const userId = req.user.id;
  AdvertUserLikes.findOne({
    where: {
      advertId: advertId,
      userId: userId
    }
  }).then(like => {
    if (like) {
      AdvertUserLikes.destroy({
        where: {
          advertId: advertId,
          userId: userId
        }
      })
        .then(() => {
          res.send({ advertId: like.id, removed: true });
        })
        .catch(next);
    } else {
      Advert.findByPk(advertId)
        .then(advert => {
          if (advert) {
            AdvertUserLikes.create({
              userId,
              advertId
            })
              .then(liked => {
                res.json(liked);
              })
              .catch(next);
          } else {
            return res.status(404).send({
              message: `Sorry advert with ${advertId} not found`
            });
          }
        })
        .catch(next);
    }
  });
});

// ROUTE TO MAKE AN APPOINTMENT
router.post("/:advertId/appointment", (req, res, next) => {
  const advertId = req.params.advertId;

  Advert.findByPk(advertId)
    .then(advert => {
      if (!advert) {
        return res.status(404).send({
          message: `Sorry advert with ${advertId} not found`
        });
      } else {
        Appointment.create({ ...req.body })
          .then(appointment => {
            AdvertAppointment.create({
              advertId: advert.id,
              appointmentId: appointment.id
            })
              .then(() => {
                res.json(appointment);
              })
              .catch(next);
          })
          .catch(next);
      }
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
  if (
    !req.body.description ||
    !req.body.address ||
    !req.body.postcode ||
    !req.body.price ||
    !req.body.advertStatus ||
    !req.body.energyLabel
  ) {
    return res.status(400).send({
      message: "Please fill in required fields"
    });
  } else {
    const userId = req.user.id;
    const { user } = req;
    Advert.create({
      ...req.body,
      userId,
      agencyId: user.agencyId
    })
      .then(newAdvert => {
        res.json({ newAdvert, user });
      })
      .catch(next);
  }
});

module.exports = router;
