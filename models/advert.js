const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user");
const Agency = require("./agency");

const Advert = db.define(
  "advert",
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    postcode: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "adverts"
  }
);

Advert.belongsTo(User);
User.hasMany(Advert);

module.exports = Advert;
