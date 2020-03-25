const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user");
const Agency = require("./agency");

const Advert = db.define(
  "advert",
  {
    isForSale: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    isForRent: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
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
    heating: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    warmWater: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    storage: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    parking: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    lat: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    lon: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    displayNameOpenMap: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    typeOpenMap: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "adverts"
  }
);

Advert.belongsTo(User);
Advert.belongsTo(Agency);
User.hasMany(Advert);
Agency.hasMany(Advert);

module.exports = Advert;
