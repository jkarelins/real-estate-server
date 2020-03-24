const Sequelize = require("sequelize");
const db = require("../../db");

const Image = db.define(
  "image",
  {
    url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    public_id: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "images"
  }
);

module.exports = Image;
