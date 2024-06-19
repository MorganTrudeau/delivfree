import { ModalRef, Positions, Status } from "delivfree";
import React, { forwardRef, useMemo, useState } from "react";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { PositionsSelect } from "./PositionsSelect";
import { useAppSelector } from "app/redux/store";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import { spacing } from "app/theme";
import { Text } from "../Text";
import { Button } from "../Button";
import { useAlert, useToast } from "app/hooks";
import { alertCommonError, getAppType } from "app/utils/general";
import { addPositions, updatePositions } from "app/apis/positions";
import { shallowEqual } from "react-redux";
import { $formLabel } from "../styles";
import { StatusPicker } from "../StatusPicker";

interface PositionsSelectModalProps {
  positions: Positions | null | undefined;
  onClose: () => void;
}

export const PositionsSelectModal = forwardRef<
  ModalRef,
  PositionsSelectModalProps
>(({ positions, onClose }, ref) => {
  return (
    <ReanimatedCenterModal ref={ref}>
      <View style={$content}>
        <Text preset={"subheading"} style={{ marginBottom: spacing.sm }}>
          Manage Positions
        </Text>
        {positions && (
          <ManagePositions positions={positions} onClose={onClose} />
        )}
      </View>
    </ReanimatedCenterModal>
  );
});

interface ManagePositionsProps {
  positions: Positions;
  onClose: () => void;
}

const ManagePositions = ({ positions, onClose }: ManagePositionsProps) => {
  const Alert = useAlert();
  const Toast = useToast();

  const isAdmin = getAppType() === "ADMIN";

  const {
    products: { vendorFullTime, vendorPartTime },
    vendorLocations,
  } = useAppSelector(
    (state) => ({
      products: state.subscription.products,
      vendorLocations: state.vendorLocations.data,
    }),
    shallowEqual
  );

  const vendorLocation = vendorLocations[positions.vendorLocation];

  const [positionsState, setPositionsState] = useState({ ...positions });
  const [loading, setLoading] = useState(false);

  const hasChanges = useMemo(
    () =>
      positionsState.maxFullTime !== positions.maxFullTime ||
      positionsState.maxPartTime !== positions.maxPartTime,
    [positions, positionsState]
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      await addPositions({
        ...positionsState,
        hasOpenings:
          positions.maxFullTime > positions.filledFullTime ||
          positions.maxPartTime > positions.filledPartTime,
        status: isAdmin ? "approved" : "pending",
      });
      setLoading(false);
      onClose();
      if (isAdmin) {
        Toast.show("Positions updated");
      } else {
        Toast.show("Positions changes sent for review");
      }
    } catch (error) {
      setLoading(false);
      alertCommonError(Alert);
    }
  };

  const handleChangeStatus = async (status: Status) => {
    try {
      setLoading(true);
      await updatePositions(positionsState.id, { status });
      setPositionsState((s) => ({ ...s, status }));
      setLoading(false);
      Toast.show("Positions status updated");
    } catch (error) {
      setLoading(false);
      alertCommonError(Alert);
    }
  };

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <>
      {vendorLocation && (
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" preset="semibold">
            {vendorLocation.name}
          </Text>
          <Text size={"xs"} numberOfLines={1} ellipsizeMode="tail">
            {vendorLocation.address}
          </Text>
        </View>
      )}

      {isAdmin && (
        <View style={{ paddingTop: spacing.sm }}>
          <Text preset="formLabel" style={$formLabel}>
            Status
          </Text>
          <StatusPicker
            status={positionsState.status}
            onPress={handleChangeStatus}
          />
        </View>
      )}

      <PositionsSelect
        positions={positionsState}
        onChangeFullTimePositions={(n) =>
          setPositionsState((s) => ({
            ...s,
            maxFullTime: n,
            availableFullTime: n - s.filledFullTime,
          }))
        }
        onChangePartTimePositions={(n) =>
          setPositionsState((s) => ({
            ...s,
            maxPartTime: n,
            availablePartTime: n - s.filledPartTime,
          }))
        }
        style={{ marginTop: spacing.md }}
      />
      <Button
        text="Save"
        preset={hasChanges ? "filled" : "default"}
        disabled={!hasChanges}
        onPress={handleSave}
        RightAccessory={Loading}
        style={{ marginTop: spacing.md }}
      />
    </>
  );
};

const $content: ViewStyle = { padding: spacing.md };
