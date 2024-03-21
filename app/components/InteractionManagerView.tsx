import React, { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

export const InteractionManagerView = ({
  children,
  LoadingComponent,
}: {
  children: React.ReactNode | React.ReactNode[];
  LoadingComponent?: React.FC;
}) => {
  const [interactionsFinished, setInteractionsFinished] = useState(false);

  useEffect(() => {
    const promise = InteractionManager.runAfterInteractions(() =>
      setInteractionsFinished(true)
    );
    return () => promise.cancel();
  }, []);

  if (!interactionsFinished) {
    return LoadingComponent ? <LoadingComponent /> : null;
  }

  return <>{children}</>;
};
