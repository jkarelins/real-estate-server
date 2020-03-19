const Sequelize = require("sequelize");
const db = require("../../db");

const Advert = require("../advert");
const Image = require("./image");

const AdvertImage = db.define(
  "advert_image",
  {
    comment: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
);

AdvertImage.belongsTo(Advert);
AdvertImage.belongsTo(Image);

Image.hasMany(AdvertImage);
Advert.hasMany(AdvertImage);

module.exports = AdvertImage;
