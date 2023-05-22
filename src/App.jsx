import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import "./App.css";
import CheckoutForm from "./CheckoutForm";
import RegisterForm from "./RegisterForm";

const stripePromise = loadStripe("pk_test_UiVpOQVVjbsMsEijVrhD2Ycg006MyZzKCE");

export default function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className='App'>
      <RegisterForm />
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm secret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
