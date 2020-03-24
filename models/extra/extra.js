const Sequelize = require("sequelize");
const db = require("../../db");

const Extra = db.define(
  "extra",
  {
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    used: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: "extras"
  }
);

module.exports = Extra;
