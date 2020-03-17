const express = require("express");
const app = express();
const port = 4000;

const userRoute = require("./routes/user");

app.use(require("cors")());
app.use(require("body-parser").json());
app.use("/user", userRoute);

app.listen(port, () => console.log(`RealEstate API running on port ${port}!`));
