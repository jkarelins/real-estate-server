const { Router } = require("express");
const router = new Router();
const { or } = require("sequelize");
const axios = require("axios");
// const crypto = require("crypto");

// const randomAddress = crypto.randomBytes(32).toString("hex");

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
        }
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
    const addressURLtry = encodeURIComponent(req.body.address);
    const postcodeURLtry = encodeURIComponent(req.body.postcode);

    axios
      .get(
        `https://nominatim.openstreetmap.org/search/${addressURLtry}?format=json`
      )
      .then(response => {
        if (response.data.length === 0) {
          axios
            .get(
              `https://nominatim.openstreetmap.org/search/${postcodeURLtry}?format=json`
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

// [
//   {
//     place_id: 33033113,
//     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
//     osm_type: 'node',
//     osm_id: 2797727874,
//     boundingbox: [ '52.3539023', '52.3540023', '4.7728892', '4.7729892' ],
//     lat: '52.3539523',
//     lon: '4.7729392',
//     display_name: '10, Hekla, De Aker, Amsterdam, Noord-Holland, Nederland, 1060NB, Nederland',
//     class: 'place',
//     type: 'house',
//     importance: 0.22100000000000003
//   }
// ]
