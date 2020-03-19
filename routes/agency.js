const { Router } = require("express");
const router = new Router();
const { getAgents } = require("../middleware/userroles");
const auth = require("../middleware/auth");

const User = require("../models/user");
const Agency = require("../models/agency");

router.get("/", auth, getAgents, (req, res, next) => {
  res.json(req.user.agency);
});

module.exports = router;
