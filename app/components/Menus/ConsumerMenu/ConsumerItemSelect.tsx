import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import BottomSheetTextInput from "app/components/BottomSheetTextInput";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { BottomSheet, BottomSheetRef } from "app/components/Modal/BottomSheet";
import { QuantitySelector } from "app/components/QuantitySelector";
import { Text } from "app/components/Text";
import { Toggle } from "app/components/Toggle";
import {
  $borderBottomLight,
  $borderTop,
  $flex,
  $row,
  isLargeScreen,
} from "app/components/styles";
import { useAlert } from "app/hooks";
import { useDimensions } from "app/hooks/useDimensions";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { addItemToCart, startCart } from "app/redux/reducers/checkoutCart";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { generateUid, localizeCurrency } from "app/utils/general";
import {
  CheckoutItem,
  CheckoutItemCustomization,
  MenuCustomization,
  MenuCustomizationChoice,
  MenuItem,
} from "delivfree";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { ConsumerCustomization } from "./ConsumerCustomization";

interface Props {
  item: MenuItem;
  vendor: string;
  vendorLocation: string;
  onClose: () => void;
}

const ConsumerItemSelect = ({
  vendor,
  vendorLocation,
  item,
  onClose,
}: Props) => {
  const Alert = useAlert();

  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const cartOrder = useAppSelector((state) => state.checkoutCart.order);
  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const dispatch = useAppDispatch();

  const { customizations, customizationsLoaded, loadCustomizations } =
    useMenusLoading({ item: item.id });

  useEffect(() => {
    loadCustomizations(false);
  }, []);

  const price = useMemo(
    () =>
      Number(item.price) ? localizeCurrency(Number(item.price), "CAD") : "",
    [item.price]
  );

  const [quantity, setQuantity] = useState(1);
  const [customizationChoices, setCustomizationChoices] = useState<{
    [customizationId: string]: {
      [choiceId: string]: {
        choice: MenuCustomizationChoice;
        quantity: number;
      };
    };
  }>({});
  const [customizationNotes, setCustomizationNotes] = useState<{
    [customizationId: string]: { text: string };
  }>({});
  const [incompleteCustomizations, setIncompleteCustomizations] =
    useState(false);

  console.log(customizationChoices);

  const choiceQuantities = useMemo(
    () =>
      Object.entries(customizationChoices).reduce(
        (acc, [customizationId, choices]) => {
          Object.values(choices).forEach((choice) => {
            acc.customizations[customizationId] =
              (acc.customizations[customizationId] || 0) + choice.quantity;
            acc.choices[choice.choice.id] = choice.quantity;
          });
          return acc;
        },
        { choices: {}, customizations: {} } as {
          choices: { [choiceId: string]: number | undefined };
          customizations: { [customizationId: string]: number | undefined };
        }
      ),
    [customizationChoices]
  );

  const totalPrice = useMemo(() => {
    return (
      Number(item.price) * quantity +
      Object.values(customizationChoices).reduce((acc, choices) => {
        return (
          acc +
          Object.values(choices).reduce(
            (acc, c) => acc + Number(c.choice.price) * c.quantity,
            0
          )
        );
      }, 0)
    );
  }, [quantity, item.price, customizationChoices]);

  const changeCustomizationNote = useCallback(
    (id: string, text: string) =>
      setCustomizationNotes((s) => {
        return {
          ...s,
          [id]: {
            text,
          },
        };
      }),
    []
  );

  const changeChoiceQuantity = useCallback(
    (
      customization: MenuCustomization,
      choice: MenuCustomizationChoice,
      quantity: number
    ) => {
      setCustomizationChoices((s) => {
        const newCustomization = {
          ...s[customization.id],
          [choice.id]: { choice, quantity },
        };

        const totalQuantity = Object.values(newCustomization).reduce(
          (acc, c) => acc + (c.choice.id === choice.id ? quantity : c.quantity),
          0
        );

        const max = Number(customization.maxChoices);
        if (max && totalQuantity > max) {
          return s;
        }

        return {
          ...s,
          [customization.id]: newCustomization,
        };
      });
    },
    []
  );

  const toggleCustomizationChoice = useCallback(
    (customization: MenuCustomization, choice: MenuCustomizationChoice) => {
      setCustomizationChoices((s) => {
        const _customization = s[customization.id];
        const selected = !!_customization?.[choice.id]?.quantity;

        if (selected) {
          const newCustomization = { ..._customization };
          delete newCustomization[choice.id];
          return {
            ...s,
            [customization.id]: newCustomization,
          };
        }

        const max = Number(customization.maxChoices);
        if (max && Object.values(_customization || {}).length >= max) {
          return s;
        }

        return {
          ...s,
          [customization.id]: {
            ...s[customization.id],
            [choice.id]: {
              choice,
              quantity: 1,
              text: "",
            },
          },
        };
      });
    },
    []
  );

  const customizationIncomplete = (c: MenuCustomization) => {
    if (
      c.type === "note" &&
      c.noteRequired &&
      !customizationNotes[c.id]?.text
    ) {
      return true;
    } else if (
      c.type === "choices" &&
      Number(c.minChoices) > 0 &&
      (choiceQuantities.customizations[c.id] || 0) < Number(c.minChoices)
    ) {
      return true;
    }
    return false;
  };

  const handleAddItemToCart = () => {
    const incompleteCustomizations = !!customizations.find((c) => {
      return customizationIncomplete(c);
    });
    setIncompleteCustomizations(incompleteCustomizations);
    if (incompleteCustomizations) {
      return Alert.alert(
        "Incomplete order",
        "Please fill out all required customizations."
      );
    }
    const checkoutItem: CheckoutItem = {
      id: generateUid(),
      item,
      quantity,
      customizations: [
        ...Object.entries(customizationChoices).reduce(
          (acc, [customization, choices]) => {
            return [
              ...acc,
              ...Object.values(choices).map((c) => ({
                ...c,
                type: "choice" as "choice",
                customization,
                allowsQuantity: !!customizations.find(
                  (c) => c.id === customization
                )?.allowsQuantity,
              })),
            ];
          },
          [] as CheckoutItemCustomization[]
        ),
        ...Object.entries(customizationNotes).reduce(
          (acc, [customization, note]) => {
            return [
              ...acc,
              { text: note.text, type: "note" as "note", customization },
            ];
          },
          [] as CheckoutItemCustomization[]
        ),
      ],
    };
    const newCart = {
      id: generateUid(),
      customer: authToken,
      vendor,
      vendorLocation,
      items: [checkoutItem],
    };
    if (cartOrder) {
      if (
        cartOrder.vendor === vendor &&
        cartOrder.vendorLocation === vendorLocation
      ) {
        dispatch(addItemToCart(checkoutItem));
      } else {
        Alert.alert(
          "Create new order?",
          "Your cart has an order from a different restaurant. Create a new order for this restaurant?",
          [
            { text: "Cancel", onPress: () => {} },
            {
              text: "New order",
              onPress: () => {
                dispatch(startCart(newCart));
              },
            },
          ]
        );
      }
    } else {
      dispatch(startCart(newCart));
    }
    onClose();
  };

  return (
    <View style={[$flex, largeScreen && { flexDirection: "row" }]}>
      {!!item.image && (
        <ItemImage
          uri={item.image}
          largeScreen={largeScreen}
          screenWidth={width}
        />
      )}
      <View style={{ padding: spacing.md, flex: 1 }}>
        <Text preset="heading">{item.name}</Text>
        {!!price && (
          <Text size={"md"} style={{ color: colors.textDim }}>
            {price}
          </Text>
        )}
        {!!item.description && (
          <Text style={{ color: colors.textDim }}>{item.description}</Text>
        )}

        {!customizationsLoaded && <ActivityIndicator color={colors.primary} />}

        {customizations.length > 0 && (
          <View style={{ marginTop: spacing.sm }}>
            {customizations.map((customization) => {
              return (
                <ConsumerCustomization
                  key={customization.id}
                  customization={customization}
                  totalChoicesSelected={
                    choiceQuantities.customizations[customization.id] || 0
                  }
                  incomplete={
                    incompleteCustomizations &&
                    customizationIncomplete(customization)
                  }
                  onChangeNote={changeCustomizationNote}
                  onSelectChoice={toggleCustomizationChoice}
                  onQuantityChange={changeChoiceQuantity}
                  choiceQuantities={choiceQuantities.choices}
                />
              );
            })}
          </View>
        )}

        <View
          style={[
            $borderTop,
            $row,
            { paddingTop: spacing.md, marginTop: spacing.sm },
          ]}
        >
          <Text preset="semibold" style={{ marginRight: spacing.sm }}>
            Quantity x {quantity}
          </Text>
          <QuantitySelector
            changeQuantity={(change) =>
              setQuantity((q) => Math.max(1, q + change))
            }
            disableDecrease={quantity <= 1}
            simplified
          />
        </View>

        <Button
          text={`Add ${quantity} to order • ${localizeCurrency(
            totalPrice,
            "CAD"
          )}`}
          preset="reversed"
          style={{ marginTop: spacing.lg }}
          onPress={handleAddItemToCart}
        />
      </View>
    </View>
  );
};

const ItemImage = memo(
  ({
    uri,
    largeScreen,
    screenWidth,
  }: {
    uri: string;
    largeScreen: boolean;
    screenWidth: number;
  }) => (
    <View style={{ padding: spacing.md }}>
      <FastImage
        source={{ uri }}
        resizeMode="cover"
        style={[
          $image,
          largeScreen
            ? { width: 500 }
            : { width: screenWidth - spacing.md * 4 },
        ]}
      />
    </View>
  )
);

export const ConsumerItemSelectModal = forwardRef<
  BottomSheetRef,
  Omit<Props, "item"> & {
    item: MenuItem | null | undefined;
    onDismiss: () => void;
  }
>(function ConsumerItemSelectModal(props, ref) {
  return (
    <BottomSheet
      ref={ref}
      onClose={props.onDismiss}
      contentStyle={{ maxWidth: 1000, alignSelf: "center" }}
    >
      <BottomSheetScrollView style={{ flex: 1, width: "100%" }}>
        {Platform.OS === "web" && (
          <View
            style={{
              paddingTop: spacing.md,
              paddingHorizontal: spacing.md,
              alignItems: "flex-start",
            }}
          >
            <Icon icon="close" onPress={props.onClose} />
          </View>
        )}
        {props.item && <ConsumerItemSelect {...props} item={props.item} />}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const $image: ImageStyle = {
  aspectRatio: 1.5,
  borderRadius: borderRadius.md,
  alignSelf: "center",
};

const $input: ViewStyle = { marginVertical: spacing.xs };
