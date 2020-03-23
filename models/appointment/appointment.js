const Sequelize = require("sequelize");
const db = require("../../db");

const Appointment = db.define(
  "appointment",
  {
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    hours: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    minutes: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    phone: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.TEXT,
      defaultValue: "published"
    }
  },
  {
    timestamps: true,
    tableName: "appointments"
  }
);

module.exports = Appointment;
