const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define(
  "user",
  {
    username: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    role: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.TEXT
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "users"
  }
);

module.exports = User;
