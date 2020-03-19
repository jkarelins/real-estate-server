const Sequelize = require("sequelize");
const db = require("../../db");

const Extra = db.define(
  "extra",
  {
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "extras"
  }
);

module.exports = Extra;
