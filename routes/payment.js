const { Router } = require("express");
const router = new Router();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.get("/:amountInCents", async (req, res, next) => {
  const { amountInCents } = req.params;
  stripe.paymentIntents
    .create({
      amount: amountInCents,
      currency: "eur",
      metadata: { integration_check: "accept_a_payment" }
    })
    .then(paymentIntent => {
      //create and send intent
      res.send(paymentIntent);
    })
    .catch(next);
});

router.post("/confirmed", (req, res, next) => {
  console.log("good");
  // confirmation received
  res.send({ confirmed: true });
});

module.exports = router;
