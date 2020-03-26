const Agency = require("../models/agency");
const User = require("../models/user");
const Advert = require("../models/advert");
const Appointment = require("../models/appointment/appointment");
const AdvertAppointment = require("../models/appointment/advertappointment");

// GET ALL AGENCY MANAGERS
function getAgents(req, res, next) {
  if (!req.user) {
    return res.status(400).send({
      message: `Something went wrong with your authorization.`
    });
  }

  const { user } = req;
  if (user.role === "agencyManager") {
    Agency.findByPk(user.agencyId, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "isAdmin"]
          }
        }
      ]
    })
      .then(foundAgencyWithUsers => {
        req.user.agency = foundAgencyWithUsers;
        next();
      })
      .catch(next);
  } else {
    next();
  }
}

//CHECK IS AGENT'S MANAGER
function isAgentManager(req, res, next) {
  if (!req.user) {
    return res.status(400).send({
      message: `Something went wrong with your authorization.`
    });
  }

  if (!req.params.agentId) {
    return res.status(400).send({
      message: `Cannot find agent with id: ${req.params.agentId}`
    });
  }

  const { user } = req;
  const { agentId } = req.params;
  if (user.role === "agencyManager") {
    User.findByPk(agentId)
      .then(foundAgent => {
        if (foundAgent.agencyId === user.agencyId) {
          next();
        } else {
          return res.status(400).send({
            message: `Manager is not agent's manager`
          });
        }
      })
      .catch(next);
  }
}

//CHECK IT IS ADVERT OWNER
function isAdvertOwner(req, res, next) {
  if (req.params.advertId) {
    Advert.findByPk(req.params.advertId)
      .then(advert => {
        if (advert.userId === req.user.id) {
          req.advert = advert;
          next();
        } else {
          res.status(400).send({
            message: "You are not the owner of advertisement"
          });
        }
      })
      .catch(next);
  } else {
    res.status(400).send({
      message: "Provide advertisement id"
    });
  }
}

// CHECK IF APPOINTMENT AUTHOR or RECEIVER OF APPOINTMENT
function hasConnectionToAppointment(req, res, next) {
  Appointment.findByPk(req.params.appId)
    .then(appointment => {
      AdvertAppointment.findOne({
        where: { appointmentId: appointment.id, userId: req.user.id }
      })
        .then(appCon => {
          if (appCon) {
            next();
          } else {
            // looking for advert owner - receiver of appointment
            AdvertAppointment.findOne({
              where: { appointmentId: appointment.id }
            }).then(appCon => {
              if (appCon) {
                Advert.findByPk(appCon.advertId)
                  .then(advert => {
                    if (advert.userId === req.user.id) {
                      next();
                    } else {
                      res.status(400).send({
                        message:
                          "Sorry it is not your Appointment, you can not change it"
                      });
                    }
                  })
                  .catch(next);
              } else {
                res.status(400).send({
                  message: "Something went erong"
                });
              }
            });
          }
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getAgents,
  isAgentManager,
  isAdvertOwner,
  hasConnectionToAppointment
};
