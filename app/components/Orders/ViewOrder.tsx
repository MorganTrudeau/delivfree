import { getUser } from "app/apis/user";
import { spacing } from "app/theme";
import { Driver, Order, User } from "delivfree";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../Text";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { $borderTop, $spacerBorder } from "../styles";
import { BottomSheet, BottomSheetRef } from "../Modal/BottomSheet";
import { ModalCloseButton } from "../Modal/ModalCloseButton";
import { DetailItem } from "../DetailItem";
import { navigateToAddress, pluralFormat } from "app/utils/general";
import { CartItem } from "../CheckoutCart/CartItem";
import { CheckoutTotals } from "../CheckoutCart/CheckoutTotals";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useDimensions } from "app/hooks/useDimensions";
import { ImageViewer, ImageViewerRef } from "../ImageViewer";
import { getDeliveryInstructionsTitle } from "app/utils/checkout";
import { DriverSelect } from "../Drivers/DriverSelect";
import { updateOrder } from "app/apis/orders";
import { useToast } from "app/hooks";
import { fetchDriver } from "app/apis/driver";
import { VendorLocationInfo } from "../VendorLocations/VendorLocationInfo";
import { useDriverCache } from "app/hooks/useCache/useDriverCache";

type Props = { order: Order; isVendor?: boolean };

const ViewOrder = ({ order, isVendor }: Props) => {
  const Toast = useToast();

  const { total, subtotal, tax, tip, currency } = order;

  const { width } = useDimensions();

  const imageViewer = useRef<ImageViewerRef>(null);

  const [customer, setCustomer] = useState<User>();
  const [driverId, setDriverId] = useState<string | null>(order.driver);

  const driver = useDriverCache(driverId);

  const loadCustomer = useCallback(async () => {
    const data = await getUser(order.customer);
    data && setCustomer(data);
  }, [order.customer]);

  useEffect(() => {
    loadCustomer();
  }, [order.customer]);

  const handleAssignDriver = useCallback(async (driver: Driver | undefined) => {
    try {
      setDriverId(driver?.id || null);
      await updateOrder(order.id, { driver: driver ? driver.id : null });
    } catch (error) {
      console.log(error);
      Toast.show("Failed to assign driver. Please try again.");
    }
  }, []);

  const dropOffPicture = order.dropOffPicture;

  const vendorLocations = useMemo(
    () => [order.vendorLocation],
    [order.vendorLocation]
  );

  return (
    <View style={{ padding: spacing.md }}>
      <Text preset="subheading" style={$subheading}>
        Customer
      </Text>

      <LoadingPlaceholder loading={!customer}>
        <DetailItem
          title={"Name"}
          value={`${customer?.firstName} ${customer?.lastName}`}
        />
      </LoadingPlaceholder>
      <LoadingPlaceholder loading={!customer}>
        <DetailItem
          title={"Address"}
          value={customer?.location?.address || "No address"}
          onPress={() =>
            customer?.location
              ? navigateToAddress(
                  customer?.location?.latitude,
                  customer?.location?.longitude,
                  customer?.location?.address
                )
              : undefined
          }
        />
      </LoadingPlaceholder>
      <LoadingPlaceholder loading={!customer}>
        <DetailItem
          title={"Phone number"}
          value={
            (customer?.callingCode || "") + (customer?.phoneNumber || "") ||
            "No phone number"
          }
        />
      </LoadingPlaceholder>
      <LoadingPlaceholder loading={!customer}>
        <DetailItem
          title={"Delivery Instructions"}
          value={
            customer?.deliveryInstructions?.note ||
            getDeliveryInstructionsTitle(customer?.deliveryInstructions?.type)
          }
        />
      </LoadingPlaceholder>
      {/* <LoadingPlaceholder loading={!customer}>
        <DetailItem
          title={"Phone number"}
          value={customer?.phoneNumber || "No number"}
        />
      </LoadingPlaceholder> */}

      <View style={$spacerBorder} />

      <Text preset="subheading" style={$subheading}>
        Location
      </Text>

      <VendorLocationInfo
        vendorLocationId={order.vendorLocation}
        style={{ marginTop: spacing.xs }}
      />

      <View style={$spacerBorder} />

      <Text preset="subheading" style={$subheading}>
        Driver
      </Text>

      {!!driverId && (
        <LoadingPlaceholder loading={!driver}>
          <DetailItem
            title={"Name"}
            value={`${driver?.firstName} ${driver?.lastName}`}
          />
        </LoadingPlaceholder>
      )}

      {isVendor && !driverId && (
        <DriverSelect
          vendorLocations={vendorLocations}
          onDriverSelect={handleAssignDriver}
          selectedDriver={order.driver}
          placeholder={"Assign driver"}
        />
      )}

      <View style={$spacerBorder} />

      <Text preset="subheading" style={$subheading}>
        {order.checkoutItems.length}{" "}
        {pluralFormat("Item", order.checkoutItems.length)}
      </Text>
      {order.checkoutItems.map((item, itemIndex, itemsArr) => {
        const lastItem = itemIndex === itemsArr.length - 1;
        return (
          <CartItem
            key={`checkout-item-${item.id}`}
            item={item}
            style={{
              paddingTop: itemIndex === 0 ? spacing.xxs : spacing.xs,
              paddingBottom: lastItem ? 0 : spacing.xs,
              borderBottomWidth: lastItem ? 0 : StyleSheet.hairlineWidth,
            }}
            showPrice={false}
          />
        );
      })}

      <View style={$spacerBorder} />

      <Text preset="subheading" style={$subheading}>
        Totals
      </Text>
      <CheckoutTotals
        currency={currency}
        total={total}
        subtotal={subtotal}
        tax={tax}
        tip={tip}
      />

      {dropOffPicture && (
        <>
          <View style={$spacerBorder} />
          <Text preset="subheading" style={$subheading}>
            Drop off confirmation
          </Text>
          <Pressable
            onPress={() => {
              imageViewer.current?.open(dropOffPicture.uri);
            }}
          >
            <Image
              source={{ uri: dropOffPicture.uri }}
              style={{
                aspectRatio:
                  (dropOffPicture.width || 1) / (dropOffPicture.height || 1),
                width: Math.min(300, width - spacing.md * 2),
              }}
              resizeMode="contain"
            />
          </Pressable>
        </>
      )}

      <ImageViewer ref={imageViewer} />
    </View>
  );
};

export const ViewOrderModal = forwardRef<
  BottomSheetRef,
  Omit<Props, "order"> & {
    onClose: () => void;
    order: Order | null | undefined;
  }
>(function ViewOrderModal(props, ref) {
  return (
    <BottomSheet ref={ref}>
      <BottomSheetScrollView>
        {props.order && <ViewOrder {...props} order={props.order} />}
      </BottomSheetScrollView>
      {Platform.OS === "web" && <ModalCloseButton onPress={props.onClose} />}
    </BottomSheet>
  );
});

const $subheading: ViewStyle = { marginBottom: spacing.xxs };
