import React from "react";

export const withStripe = <P extends {}>(Component: React.ComponentType<P>) => {
  return function WithStripe(props: P) {
    return <Component {...props} />;
  };
};
