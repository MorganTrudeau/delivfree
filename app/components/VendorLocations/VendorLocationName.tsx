import { useVendorLocationCache } from "app/hooks/useCache/useVendorLocationCache";
import React from "react";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Text, TextProps } from "../Text";

export const VendorLocationName = ({
  id,
  ...rest
}: { id: string } & TextProps) => {
  const vendorLocation = useVendorLocationCache(id);

  return (
    <LoadingPlaceholder
      loading={!vendorLocation}
      loadingStyle={{ maxWidth: 300 }}
    >
      <Text {...rest}>{vendorLocation?.name}</Text>
    </LoadingPlaceholder>
  );
};
