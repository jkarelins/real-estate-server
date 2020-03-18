const express = require("express");
const app = express();
const port = 4000;

const userRoute = require("./routes/user");
const advertRoute = require("./routes/advert");

app.use(require("cors")());
app.use(require("body-parser").json());
app.use("/user", userRoute);
app.use("/advert", advertRoute);

app.listen(port, () => console.log(`RealEstate API running on port ${port}!`));
