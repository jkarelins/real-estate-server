const Sequelize = require("sequelize");

const databaseURL =
  process.env.DATABASE_URL ||
  "postgres://postgres:complicatedPassword@localhost:5432/postgres";

const db = new Sequelize(databaseURL);

db.sync()
  .then(() => console.log(`DB synced.`))
  .catch(err => console.log(err));

module.exports = db;
