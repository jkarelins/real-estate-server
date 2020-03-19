const User = require("../models/user");
const Agency = require("../models/agency");

function checkForCredits(req, res, next) {
  const { user } = req;
  if (user.freeAdvertLimit > 0) {
    User.findByPk(user.id)
      .then(user => {
        user.freeAdvertLimit = user.freeAdvertLimit - 1;
        user
          .save()
          .then(user => {
            req.user = user;
            return next();
          })
          .catch(next);
      })
      .catch(next);
  } else if (user.paidAdvertLimit > 0) {
    User.findByPk(user.id)
      .then(user => {
        user.paidAdvertLimit = user.paidAdvertLimit - 1;
        user
          .save()
          .then(user => {
            req.user = user;
            return next();
          })
          .catch(next);
      })
      .catch(next);
  } else if (user.agencyId) {
    if (
      user.agency.advertBalance > 0 &&
      (user.agentConfirmedByManager === true || user.role === "agencyManager")
    ) {
      Agency.findByPk(user.agencyId)
        .then(agency => {
          agency.advertBalance = agency.advertBalance - 1;
          agency
            .save()
            .then(agency => {
              req.user.agency.advertBalance = agency.advertBalance;
              return next();
            })
            .catch(next);
        })
        .catch(next);
    }
  } else {
    return res.status(400).send({
      message:
        "Sorry you have not enough credits, or your manager have not confirmed your account."
    });
  }
}

module.exports = { checkForCredits };
