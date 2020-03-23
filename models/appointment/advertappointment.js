const db = require("../../db");

const Advert = require("../advert");
const Appointment = require("./appointment");
const User = require("../user");

const AdvertAppointment = db.define(
  "advert_appointment",
  {},
  {
    timestamps: false
  }
);

AdvertAppointment.belongsTo(Advert);
AdvertAppointment.belongsTo(Appointment);
AdvertAppointment.belongsTo(User);

Appointment.hasMany(AdvertAppointment);
Advert.hasMany(AdvertAppointment);
User.hasMany(AdvertAppointment);
//in User here we store userId of appointment requestor

module.exports = AdvertAppointment;
