const db = require("../../db");

const Advert = require("../advert");
const Extra = require("./extra");

const AdvertExtra = db.define(
  "advert_extra",
  {},
  {
    timestamps: false
  }
);

AdvertExtra.belongsTo(Advert);
AdvertExtra.belongsTo(Extra);

Extra.hasMany(AdvertExtra);
Advert.hasMany(AdvertExtra);

module.exports = AdvertExtra;
