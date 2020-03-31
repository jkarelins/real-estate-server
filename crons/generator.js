const User = require("../models/user");
const Agency = require("../models/agency");
const Advert = require("../models/advert");
const Image = require("../models/image/image");
const AdvertImage = require("../models/image/advert_image");
const Extra = require("../models/extra/extra");
const AdvertExtra = require("../models/extra/advert_extra");
const AdvertUserLikes = require("../models/aduserlikes");
const Appointment = require("../models/appointment/appointment");
const AdvertAppointment = require("../models/appointment/advertappointment");

const cron = require("node-cron");
const axios = require("axios");

const AGENCY_MANAGER = "agencyManager";
const PRIVATE_PERSON = "privatePerson";

function generateNew() {
  axios
    .get("https://fast-spire-97359.herokuapp.com/")
    .then(response => {
      const { data } = response;
      User.create({ ...data.user })
        .then(user => {
          if (user.role === AGENCY_MANAGER) {
            Agency.create({ name: data.user.name })
              .then(agency => {
                user.agencyId = agency.id;
                user
                  .save()
                  .then(() => createAdvert(data, user.id, user))
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            createAdvert(data, user.id, user);
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

function createAdvert(data, userId, user) {
  const energyLabel = "C";
  const addressURLtry = encodeURIComponent(`${data.newAdress.address}`);
  const postcodeURLtry = encodeURIComponent(
    data.newAdress.postcode.replace(/\s/g, "")
  );

  axios
    .get(
      `https://nominatim.openstreetmap.org/search/${postcodeURLtry}?format=json`
    )
    .then(response => {
      if (response.data.length === 0) {
        axios
          .get(
            `https://nominatim.openstreetmap.org/search/${addressURLtry}?format=json`
          )
          .then(response => {
            if (response.data.length === 0) {
              return;
            } else {
              const first = response.data[0];

              Advert.create({
                ...data.newAdress,
                userId,
                postcode: data.newAdress.postcode
                  .toUpperCase()
                  .replace(/\s/g, ""),
                energyLabel,
                city: data.newAdress.city.replace(/^\w/, c => c.toUpperCase()),
                agencyId: user.agencyId,
                lat: first.lat,
                lon: first.lon,
                displayNameOpenMap: first.display_name,
                typeOpenMap: first.type
              })
                .then(newAdvert => {
                  return;
                })
                .catch(err => {
                  console.log(err);
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        const first = response.data[0];

        Advert.create({
          ...data.newAdress,
          userId,
          postcode: data.newAdress.postcode.toUpperCase().replace(/\s/g, ""),
          energyLabel,
          city: data.newAdress.city.replace(/^\w/, c => c.toUpperCase()),
          agencyId: user.agencyId,
          lat: first.lat,
          lon: first.lon,
          displayNameOpenMap: first.display_name,
          typeOpenMap: first.type
        })
          .then(newAdvert => {
            return;
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function generator(config) {
  cron.schedule(config, () => {
    generateNew();
    console.log("creating new advert every 1 hour");
    //can be removed later, console just to check, that it runs each 1 hour
    require("console-stamp")(console, "[HH:MM:ss.l]");
  });
}

module.exports = generator;
