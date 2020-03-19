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

module.exports = { getAgents, isAgentManager };
