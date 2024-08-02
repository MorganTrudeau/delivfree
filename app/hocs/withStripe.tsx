import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { stripeApiKey } from "../../app.json";

export const withStripe = <P extends {}>(Component: React.ComponentType<P>) => {
  return function WithStripe(props: P) {
    return (
      <StripeProvider
        publishableKey={stripeApiKey}
        urlScheme="delivfree" // required for 3D Secure and bank redirects
        // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
      >
        <Component {...props} />
      </StripeProvider>
    );
  };
};
