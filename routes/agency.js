const { Router } = require("express");
const router = new Router();
const { getAgents, isAgentManager } = require("../middleware/userroles");
const auth = require("../middleware/auth");

const User = require("../models/user");
const Agency = require("../models/agency");

router.get("/", auth, getAgents, (req, res, next) => {
  res.json(req.user.agency);
});

//ENABLE DISABLE AGENT - e.g. http://localhost:4000/agency/agent/5?action=DISABLE
router.get("/agent/:agentId", auth, isAgentManager, (req, res, next) => {
  if (!req.query.action) {
    return res.send(400).send({
      message: "Sorry action or agent not found in query."
    });
  }

  const { action } = req.query;
  const { agentId } = req.params;
  User.findByPk(agentId)
    .then(foundAgent => {
      if (foundAgent.role !== "agencyAgent") {
        return res.send(400).send({
          message: "User is not agent in our database"
        });
      }

      if (action === "ENABLE") {
        foundAgent.agentConfirmedByManager = true;
        foundAgent
          .save()
          .then(updatedAgent => {
            res.send(updatedAgent);
          })
          .catch(next);
      } else if (action === "DISABLE") {
        foundAgent.agentConfirmedByManager = false;
        foundAgent
          .save()
          .then(updatedAgent => {
            res.send(updatedAgent);
          })
          .catch(next);
      } else {
        return res.send(400).send({
          message: "Action not recognized by server."
        });
      }
    })
    .catch(next);
});

module.exports = router;
