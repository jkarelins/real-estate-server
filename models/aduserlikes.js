const db = require("../db");

const Advert = require("./advert");
const User = require("./user");

const AdvertUserLikes = db.define(
  "advert_user_likes",
  {},
  {
    timestamps: false
  }
);

AdvertUserLikes.belongsTo(Advert);
AdvertUserLikes.belongsTo(User);

User.hasMany(AdvertUserLikes);
Advert.hasMany(AdvertUserLikes);

module.exports = AdvertUserLikes;
