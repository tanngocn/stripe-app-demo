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

app.get("/payment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    const card = paymentIntent.charges.data[0].payment_method_details.card;

    // await stripe.paymentIntents.update(id, { customer: "cus_NwT3exUeRAnBFE" });
    // console.log(paymentIntent.charges.data);
    // console.log("Card:", card);
    // Access the desired card details
    // console.log("Card Brand:", card.brand);
    // console.log("Card Last 4 Digits:", card.last4);
    // console.log("Card Expiration Month:", card.exp_month);
    // console.log("Card Expiration Year:", card.exp_year);
    // Handle card information
    res.status(200);
  } catch (error) {
    console.log("Error retrieving Payment Intent:", error.message);
    // Handle error
  }
});
app.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({
      email,
    });
    if (customer) {
      console.log(customer.id);
      res.status(200).send({ message: "create customer success", code: "200" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/card-details/:id", async (req, res) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(req.params.id);

    if (paymentMethod.type === "card") {
      const card = paymentMethod.card;
      console.log("Card Brand:", card.brand);
      console.log("Card Last 4 Digits:", card.last4);
      console.log("Card Expiration Month:", card.exp_month);
      console.log("Card Expiration Year:", card.exp_year);
      // Handle card information
    } else {
      console.log("Payment method is not a card.");
      // Handle other types of payment methods if necessary
    }
  } catch (error) {
    console.log("Error retrieving payment method:", error.message);
    // Handle error
  }
});
app.post("/update", async (req, res) => {
  const { method, id } = req.body;
  console.log(method);
  try {
    const paymentIntent = await stripe.paymentIntents.update(id, { payment_method: method });

    console.log(paymentIntent);
  } catch (e) {
    console.log(e);
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency

  // console.log(customer);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    customer: req?.customer?.id,
    automatic_payment_methods: {
      enabled: true,
    },
    setup_future_usage: "off_session",
  });
  // const card = paymentIntent.charges.data[0].payment_method_details.card;

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
