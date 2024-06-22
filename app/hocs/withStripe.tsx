import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";

export const withStripe = <P extends {}>(Component: React.ComponentType<P>) => {
  return function WithStripe(props: P) {
    return (
      <StripeProvider
        publishableKey="pk_test_51P5xHH076A0nkV3SRDnuCLj3BmRHmwlz6xsFcG8ORd5Gdc1tVzbsTJQKmKmmuL2A6W3nPDHTklD8oRpFmMmRloiI00JMw181zS"
        urlScheme="delivfree" // required for 3D Secure and bank redirects
        // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
      >
        <Component {...props} />
      </StripeProvider>
    );
  };
};
