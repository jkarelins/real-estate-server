const { Router } = require("express");
const router = new Router();
const { or, Op } = require("sequelize");
const axios = require("axios");

const User = require("../models/user");
const Agency = require("../models/agency");
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
  if (req.query.city) {
    const { city } = req.query;
    return findAdvertsByCityName(req, res, next, limit, offset, city);
  }
  return finAllAdverts(req, res, next, limit, offset);
});

//GET ALL USER'S || AGENCY'S RELATED ADVERTISEMENTS
router.get("/myadvert", auth, (req, res, next) => {
  const { id, agencyId } = req.user;
  Advert.findAll({
    where: or({ userId: id }, { agencyId: agencyId }),
    include: [{ model: AdvertAppointment, include: [{ model: Appointment }] }]
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
router.post("/:advertId/appointment", auth, (req, res, next) => {
  const advertId = req.params.advertId;
  const userId = req.user.id;

  Advert.findByPk(advertId)
    .then(advert => {
      if (!advert) {
        return res.status(404).send({
          message: `Sorry advert with ${advertId} not found`
        });
      } else {
        User.findByPk(userId)
          .then(user => {
            Appointment.create({ ...req.body })
              .then(appointment => {
                AdvertAppointment.create({
                  advertId: advert.id,
                  appointmentId: appointment.id,
                  userId: userId
                })
                  .then(appointment => {
                    res.json({ appointment });
                  })
                  .catch(next);
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
        },
        include: [Agency]
      },
      { model: AdvertImage, include: [Image] },
      { model: AdvertExtra, include: [Extra] }
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
    !req.body.city ||
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
    const addressURLtry = encodeURIComponent(
      `${req.body.address}, ${req.body.city}`
    );
    const postcodeURLtry = encodeURIComponent(
      req.body.postcode.replace(/\s/g, "")
    );

    axios
      .get(
        `https://nominatim.openstreetmap.org/search/${postcodeURLtry}?format=json`
      )
      .then(response => {
        if (response.data.length === 0) {
          axios
            .get(
              `https://nominatim.openstreetmap.org/search/${addressURLtry}?format=json`
            )
            .then(response => {
              if (response.data.length === 0) {
                return res.status(400).send({
                  message:
                    "Address not found in our database. Check your address"
                });
              } else {
                const { data } = response;
                const first = data[0];

                Advert.create({
                  ...req.body,
                  userId,
                  postcode: req.body.postcode.toUpperCase().replace(/\s/g, ""),
                  energyLabel: req.body.energyLabel.toUpperCase(),
                  city: req.body.city.replace(/^\w/, c => c.toUpperCase()),
                  agencyId: user.agencyId,
                  lat: first.lat,
                  lon: first.lon,
                  displayNameOpenMap: first.display_name,
                  typeOpenMap: first.type
                })
                  .then(newAdvert => {
                    res.json({ newAdvert, user });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else {
          const { data } = response;
          const first = data[0];

          Advert.create({
            ...req.body,
            userId,
            postcode: req.body.postcode.toUpperCase().replace(/\s/g, ""),
            energyLabel: req.body.energyLabel.toUpperCase(),
            city: req.body.city.replace(/^\w/, c => c.toUpperCase()),
            agencyId: user.agencyId,
            lat: first.lat,
            lon: first.lon,
            displayNameOpenMap: first.display_name,
            typeOpenMap: first.type
          })
            .then(newAdvert => {
              res.json({ newAdvert, user });
            })
            .catch(next);
        }
      })
      .catch(next);
  }
});

module.exports = router;

function finAllAdverts(req, res, next, limit, offset) {
  Advert.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "isAdmin"]
        }
      },
      {
        model: AdvertImage,
        limit: 1,
        include: [Image]
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
}

function findAdvertsByCityName(req, res, next, limit, offset, city) {
  Advert.findAndCountAll({
    where: {
      city: {
        [Op.iLike]: `%${city}%`
      }
    },
    limit,
    offset,
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "isAdmin"]
        }
      },
      {
        model: AdvertImage,
        limit: 1,
        include: [Image]
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
}
