const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const userRoute = require("./routes/user");
const advertRoute = require("./routes/advert");
const agencyRoute = require("./routes/agency");
const appointmentRoute = require("./routes/appointment");
const imageRoute = require("./routes/images");
const extraRoute = require("./routes/extra");
const paymentRoute = require("./routes/payment");
const generator = require("./crons/generator");

app.use(require("cors")());
app.use(require("body-parser").json());
app.use("/user", userRoute);
app.use("/advert", advertRoute);
app.use("/agency", agencyRoute);
app.use("/appointment", appointmentRoute);
app.use("/image", imageRoute);
app.use("/extra", extraRoute);
app.use("/payment", paymentRoute);

//SHOULD RUN EACH HOUR
const eachHour = "0 0-23 * * *";
const every4Minutes = "*/4 0-23 * * *";
generator(every4Minutes);

app.listen(port, () => console.log(`RealEstate API running on port ${port}!`));
