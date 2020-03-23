const { Router } = require("express");
const router = new Router();
const Appointment = require("../models/appointment/appointment");

router.get("/:randomAddress", (req, res, next) => {
  if (req.params.randomAddress) {
    const { randomAddress } = req.params;
    Appointment.findOne({ where: { randomAddress: randomAddress } })
      .then(appointment => {
        if (appointment) {
          res.json(appointment);
        } else {
          res.status(400).send({
            message: "Appointment was not found in our database."
          });
        }
      })
      .catch(next);
  } else {
    res.status(404).send({
      message: "Appointment was not found in our database."
    });
  }
});

module.exports = router;
