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
    },
    // If not verified by admin -> manager can not login
    isVerifiedByAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    // If agency is not confirmed -> agent can not post new advertisements
    agencyConfirmedByManager: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    // if user is blocked by Admin -> cannot login
    isBlockedByAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    freeAdvertLimit: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    paidAdvertLimit: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "users"
  }
);

module.exports = User;
