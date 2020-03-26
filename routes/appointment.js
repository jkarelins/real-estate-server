const { Router } = require("express");
const router = new Router();

const auth = require("../middleware/auth");
const { hasConnectionToAppointment } = require("../middleware/userroles");

const Appointment = require("../models/appointment/appointment");
const AdvertAppointment = require("../models/appointment/advertappointment");

// FOUND ALL USER ASOCIATED APPOINTMENTS
router.get("/all", auth, (req, res, next) => {
  AdvertAppointment.findAll({
    where: { userId: req.user.id },
    include: [Appointment]
  })
    .then(appointments => {
      res.json(appointments);
    })
    .catch(next);
});

// GET USER APOINTMENT IF IT WAS ADDED FOR CURRENT ADVERT
router.get("/:advertId/advert", auth, (req, res, next) => {
  AdvertAppointment.findOne({
    where: { advertId: req.params.advertId, userId: req.user.id },
    include: [Appointment]
  })
    .then(foundAdvertApp => {
      if (foundAdvertApp) {
        res.send({ found: true, foundAdvertApp });
      } else {
        res.send({ found: false });
      }
    })
    .catch(next);
});

// EDIT ONE APPOINTMENT - IF AUTHOR or RECEIVER OF APPOINTMENT
router.put(
  "/:appId/edit",
  auth,
  hasConnectionToAppointment,
  (req, res, next) => {
    Appointment.findByPk(req.params.appId).then(appointment => {
      appointment
        .update(req.body)
        .then(updated => {
          res.send(updated);
        })
        .catch(next);
    });
  }
);

// CANCEL APPOINTMENT IF ADDED BY THIS USER
router.put("/:appId", auth, hasConnectionToAppointment, (req, res, next) => {
  Appointment.findByPk(req.params.appId).then(appointment => {
    appointment.status = "canceled";
    appointment
      .save()
      .then(appointment => res.json(appointment))
      .catch(next);
  });
});

module.exports = router;

// WAS USED EARLIER TO GET ROUTE USING RANDOM HEX
// router.get("/:randomAddress",auth, (req, res, next) => {
//   if (req.params.randomAddress) {
//     const { randomAddress } = req.params;
//     Appointment.findOne({ where: { randomAddress: randomAddress } })
//       .then(appointment => {
//         if (appointment) {
//           res.json(appointment);
//         } else {
//           res.status(400).send({
//             message: "Appointment was not found in our database."
//           });
//         }
//       })
//       .catch(next);
//   } else {
//     res.status(404).send({
//       message: "Appointment was not found in our database."
//     });
//   }
// });
