const { Router } = require("express");
const router = new Router();
require("dotenv").config();
const auth = require("../middleware/auth");

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.get("/:amountInCents", auth, async (req, res, next) => {
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

module.exports = router;
