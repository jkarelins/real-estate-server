const { createMollieClient } = require("@mollie/api-client");
const { Router } = require("express");
const router = new Router();
require("dotenv").config();

// const mollieClient = createMollieClient({
//   apiKey: process.env.MOLLIE_TEST_KEY
// });

// router.get("/", (req, res, next) => {
//   mollieClient.payments
//     .create({
//       amount: {
//         value: "10.00",
//         currency: "EUR"
//       },
//       description: "My first API payment",
//       redirectUrl: "https://yourwebshop.example.org/order/123456",
//       webhookUrl: "https://yourwebshop.example.org/webhook"
//     })
//     .then(payment => {
//       console.log(payment.getCheckoutUrl());
//       // Forward the customer to the payment.getCheckoutUrl()
//     })
//     .catch(error => {
//       console.log(error);
//       // Handle the error
//     });
// });

module.exports = router;
