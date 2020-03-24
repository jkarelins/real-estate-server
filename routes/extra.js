const { Router } = require("express");
const router = new Router();

const Extra = require("../models/extra/extra");
const AdvertExtra = require("../models/extra/advert_extra");

const auth = require("../middleware/auth");
const { isAdvertOwner } = require("../middleware/userroles");

// ADD ONE EXTRA TO ADVERTISEMENT
router.post("/add/:advertId", auth, isAdvertOwner, (req, res, next) => {
  if (req.body.text && req.params.advertId) {
    const { advertId } = req.params;
    const { text } = req.body;
    const newText = text.toLowerCase();

    Extra.findOne({ where: { text: newText } }).then(extra => {
      if (extra) {
        AdvertExtra.findOne({
          where: { advertId: advertId, extraId: extra.id }
        }).then(extraCon => {
          // console.log("REACHED............................................");
          if (extraCon) {
            return res.status(400).send({
              message: "Sorry this extra was added to this advertisement before"
            });
          } else {
            extra.used = extra.used + 1;
            extra
              .save()
              .then(() => {
                AdvertExtra.create({ advertId: advertId, extraId: extra.id })
                  .then(() => {
                    return res.send(extra);
                  })
                  .catch(next);
              })
              .catch(next);
          }
        });
      } else {
        Extra.create({ text: newText, used: 1 })
          .then(newExtra => {
            AdvertExtra.create({ advertId: advertId, extraId: newExtra.id })
              .then(() => {
                return res.send(newExtra);
              })
              .catch(next);
          })
          .catch(next);
      }
    });
  }
});

//GET ALL EXTRAS SORTED BY USED COUNT, MOST POPULAR FIRST
router.get("/all", (req, res, next) => {
  Extra.findAll({
    order: [["used", "DESC"]]
  })
    .then(extras => {
      res.send(extras);
    })
    .catch(next);
});

// REMOVE ONE CONNECTION ADVERT < - > EXTRA
router.delete(
  "/:extraId/remove/:advertId",
  auth,
  isAdvertOwner,
  (req, res, next) => {
    if (req.params.extraId && req.params.advertId) {
      const { advertId, extraId } = req.params;
      AdvertExtra.findOne({ where: { advertId: advertId, extraId: extraId } })
        .then(extraCon => {
          if (extraCon) {
            extraCon
              .destroy()
              .then(() => res.send({ deleted: true, extraCon }))
              .catch(next);
          } else {
            res.status(400).send({
              message: "This extra for this Advertisement not found."
            });
          }
        })
        .catch(next);
    }
  }
);

module.exports = router;
