const Sequelize = require("sequelize");

const databaseURL =
  process.env.DATABASE_URL ||
  "postgres://postgres:password@localhost:5432/postgres";

const db = new Sequelize(databaseURL, { logging: false });

db.sync()
  .then(() => console.log(`DB synced.`))
  .catch(err => console.log(err));

module.exports = db;
