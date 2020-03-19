const db = require("../../db");

const Advert = require("../advert");
const Appointment = require("./appointment");

const AdvertAppointment = db.define(
  "advert_appointment",
  {},
  {
    timestamps: false
  }
);

AdvertAppointment.belongsTo(Advert);
AdvertAppointment.belongsTo(Appointment);

Appointment.hasMany(AdvertAppointment);
Advert.hasMany(AdvertAppointment);

module.exports = AdvertAppointment;
