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
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    postcode: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sqrMeter: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cubicMeter: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    nrOfRooms: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    nrOfBathrooms: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    nrOfFloors: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    locatedOnFloor: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    advertStatus: {
      type: Sequelize.STRING,
      allowNull: false
    },
    monthlyContribution: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    constructionYear: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    renovationYear: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    energyLabel: {
      type: Sequelize.STRING,
      allowNull: false
    },
    storage: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    parking: {
      type: Sequelize.TEXT,
      allowNull: true
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
