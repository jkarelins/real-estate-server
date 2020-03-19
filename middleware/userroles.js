const Agency = require("../models/agency");
const User = require("../models/user");

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

module.exports = { getAgents };
