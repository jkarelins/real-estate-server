const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user");

const Agency = db.define(
  "agency",
  {
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    advertBalance: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "agencies"
  }
);

User.belongsTo(Agency);
Agency.hasMany(User);

module.exports = Agency;
