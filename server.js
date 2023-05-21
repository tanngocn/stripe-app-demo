const express = require("express");
const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")("sk_test_MW7ZnpfbEXYvX49ZLSM59YhM00V7NW2fcR");

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};
// register
app.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({
      email,
    });
    if (customer) {
      req.customer = customer;
      res.status(200).send({ message: "create customer success", code: "200" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    // setup_future_usage: "on_session",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
