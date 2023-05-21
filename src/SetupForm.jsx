import React, {useEffect, useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const SetupForm = ({secret}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (!stripe) {
      return;
    }
    let client_secret = new URLSearchParams(window.location.search).get(
      'setup_intent_client_secret'
    );
    const clientSecret = client_secret ? client_secret : secret;
    stripe.retrieveSetupIntent(clientSecret)
      .then(({setupIntent}) => {
        // eslint-disable-next-line default-case
        switch (setupIntent.status) {
          case 'succeeded':
            setMessage('Success! Your payment method has been saved.');
            break;

          case 'processing':
            setMessage("Processing payment details. We'll update you when processing is complete.");
            break;

          case 'requires_payment_method':

            setMessage('');
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return null;
    }

    const {error} = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000',
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
      {/* Show error message to your customers */}
      {message && <div>{message}</div>}
    </form>
  )
};

export default SetupForm;