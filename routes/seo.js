const { Router } = require("express");
const router = new Router();
const { or, Op } = require("sequelize");

const Advert = require("../models/advert");

// Route to get all cities of adverts for seo routes
router.get('/cities', (req, res, next) => {
  Advert.findAll()
  .then(adverts => {
    const cities = adverts.map(advert => advert.city);
    res.send(cities);
  })
  .catch(next);
});

module.exports = router;
